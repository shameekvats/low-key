// Vercel Serverless Function for Stripe Checkout (ES6)
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { priceId, quantity = 1, email, collectPhone = false } = req.body;

    if (!priceId) {
      res.status(400).json({ error: 'Price ID is required' });
      return;
    }

    // Create Checkout Session with customer creation
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: parseInt(quantity),
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://lowkey.lu'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://lowkey.lu'}/event-moonresort-13032026.html`,
      customer_creation: 'always', // Always create a customer
//      billing_address_collection: 'never', // Do not collect billing address
      
      // Metadata that appears in receipts for all tickets
      metadata: {
        event_name: 'The Journey: Low Key × Radio Paffental',
        event_date: 'Friday, March 13, 2026',
        event_time: '21h — 03h',
        event_location: '📍 Brasserie Abtei, Neimenster Abbey',
        contact_email: 'lowkeylxb@gmail.com',
      },
      
      // Add to payment intent so metadata appears in receipt
      payment_intent_data: {
        metadata: {
          event_name: 'The Journey: Low Key × Radio Paffental',
          event_date: 'Friday, March 13, 2026',
          event_time: '21h — 03h',
          event_location: '📍 Brasserie Abtei, Neimenster Abbey',
          contact_email: 'lowkeylxb@gmail.com',
        },
      },
    };

    // Add phone collection only if requested
    if (collectPhone) {
      sessionConfig.phone_number_collection = { enabled: true };
    }

    // Add customer email if provided
    if (email) {
      sessionConfig.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
}
