// Vercel Serverless Function — invite request form → email (ES6)
// Sends via the Resend REST API using global fetch (Node 18+), so no npm dependency.
//
// Required env var:  RESEND_API_KEY
// Optional env vars: INVITE_NOTIFY_EMAIL (default lowkeylxb@gmail.com)
//                    RESEND_FROM         (default onboarding@resend.dev)

const NOTIFY_TO = process.env.INVITE_NOTIFY_EMAIL || 'lowkeylxb@gmail.com';
const FROM = process.env.RESEND_FROM || 'Low Key Invites <onboarding@resend.dev>';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Trim, cap length, and strip control characters that have no business in an email header.
function clean(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1F\x7F]/g, ' ').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // Honeypot: bots fill hidden fields. Answer 200 so they learn nothing.
    if (clean(body.website, 50)) {
      res.status(200).json({ ok: true });
      return;
    }

    const name = clean(body.name, 100);
    const email = clean(body.email, 200);
    const guests = Number(clean(body.guests, 10));
    const event = clean(body.event, 120) || 'halloween: low key x nam ca phe';

    if (!name) {
      res.status(400).json({ error: 'Please tell us your name.' });
      return;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
      res.status(400).json({ error: 'Please enter how many of you are joining (1-10).' });
      return;
    }

    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set - cannot send invite request email');
      res.status(500).json({ error: 'Invite requests are temporarily unavailable. Please email us instead.' });
      return;
    }

    const text = [
      'new invite request',
      '',
      'event:  ' + event,
      'name:   ' + name,
      'people: ' + guests,
      'email:  ' + email,
    ].join('\n');

    const html = '<div style="font-family: monospace; font-size: 14px; line-height: 1.7;">'
      + '<p><strong>new invite request</strong></p><p>'
      + '<strong>event:</strong> ' + escapeHtml(event) + '<br>'
      + '<strong>name:</strong> ' + escapeHtml(name) + '<br>'
      + '<strong>people:</strong> ' + guests + '<br>'
      + '<strong>email:</strong> ' + escapeHtml(email)
      + '</p></div>';

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY_TO],
        reply_to: email,
        subject: 'invite request - ' + event + ' - ' + name,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Resend rejected the invite request email:', response.status, detail);
      res.status(502).json({ error: 'We could not send your request. Please email us instead.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error handling invite request:', err);
    res.status(500).json({ error: 'Something went wrong. Please email us instead.' });
  }
}
