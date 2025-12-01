# Low Key Events Website

A minimal, clean event listing website inspired by giegling.net. Simple HTML, CSS, and JavaScript with no frameworks or themes.

## Features

- **Minimal Design** - Clean, distraction-free interface
- **Responsive Layout** - Works on all devices
- **Featured Event** - Showcase your next event with a poster
- **Event List** - Simple chronological list of upcoming events
- **Payment Ready** - Structured for easy payment integration

## Getting Started

### View Locally

1. Open `index.html` in your web browser
2. That's it! No build process or dependencies needed.

### Project Structure

```
low key/
├── index.html      # Main HTML structure
├── style.css       # All styling
├── script.js       # JavaScript for interactivity
└── README.md       # This file
```

## Customization

### Adding Events

Edit the events list in `index.html`:

```html
<li class="event-item">
    <span class="event-date">Fri, 20.12.25</span>
    <a href="#" class="event-link">your event name</a>
</li>
```

### Changing the Featured Event

Replace the poster image and update the overlay content in `index.html`:

```html
<div class="poster-overlay">
    <h2>Next Event</h2>
    <p class="event-date">Fri, 20.12.25</p>
    <a href="#" class="btn-tickets">Get Tickets</a>
</div>
```

### Adding Your Event Poster

1. Add your poster image (e.g., `poster.jpg`) to the root folder
2. Update the `src` attribute in `index.html`:
   ```html
   <img src="poster.jpg" alt="Upcoming Event" class="event-poster">
   ```

### Customizing Colors

Edit variables in `style.css`:

```css
/* Current theme: Black & White minimal */
background-color: #ffffff;  /* Page background */
color: #000000;             /* Text color */
```

## Payment Integration

### Option 1: Stripe (Recommended)

1. **Sign up** at [stripe.com](https://stripe.com)
2. **Get your API keys** from the Stripe Dashboard
3. **Add Stripe.js** to `index.html` before closing `</body>`:
   ```html
   <script src="https://js.stripe.com/v3/"></script>
   ```
4. **Update event links** to use payment function:
   ```html
   <a href="#" onclick="initializePayment('event-id'); return false;">Get Tickets</a>
   ```
5. **Implement payment logic** in `script.js`:
   ```javascript
   const stripe = Stripe('your_publishable_key');
   
   function initializePayment(eventId) {
       stripe.redirectToCheckout({
           lineItems: [{price: 'price_xxxxx', quantity: 1}],
           mode: 'payment',
           successUrl: window.location.origin + '/success.html',
           cancelUrl: window.location.origin + '/cancel.html',
       });
   }
   ```

### Option 2: PayPal

1. **Sign up** at [paypal.com/business](https://www.paypal.com/business)
2. **Add PayPal SDK** to `index.html`:
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
   ```
3. **Add PayPal buttons** to your event pages

### Option 3: Simple Payment Links

For the simplest approach:
- Create payment links in Stripe/PayPal dashboard
- Replace `href="#"` with your payment link:
  ```html
  <a href="https://buy.stripe.com/your-link">Get Tickets</a>
  ```

## Deployment

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository
2. Push your code to the `main` branch
3. Go to Settings → Pages
4. Select `main` branch as source
5. Your site will be live at `https://yourusername.github.io/low-key`

### Option 2: Netlify (Free)

1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop your folder
3. Your site is live instantly with HTTPS

### Option 3: Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Automatic deployments on every push

## Next Steps

1. **Add your poster image** - Replace `poster.jpg` with your event poster
2. **Update event list** - Add your real events with dates
3. **Customize branding** - Change colors, fonts, and text to match your style
4. **Set up payment** - Follow one of the payment integration guides above
5. **Deploy** - Choose a hosting option and go live

## Tips

- Keep the design minimal - less is more
- Use high-quality images for posters (1200x1600px recommended)
- Test on mobile devices - most users will browse on phones
- Set up analytics (Google Analytics) to track visitors
- Consider adding an email signup form for announcements

## Support

For questions or issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [MDN Web Docs](https://developer.mozilla.org/) for HTML/CSS/JS help

---

Built with simplicity in mind. No frameworks, no bloat, just clean code.
