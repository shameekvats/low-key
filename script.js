// Simple script for future interactivity

document.addEventListener('DOMContentLoaded', function() {
    console.log('Low Key Events - Site loaded successfully');

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Example: Dynamic event loading (for future use)
    function loadEvents() {
        // This function can be used to fetch events from an API
        // For now, events are hardcoded in HTML
        console.log('Events loaded from HTML');
    }

    // Example: Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe event items for fade-in animation
    document.querySelectorAll('.event-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });

    loadEvents();
});

// Example function for future payment integration
function initializePayment(eventId) {
    // This will be used when integrating Stripe/PayPal
    console.log(`Initialize payment for event: ${eventId}`);
    
    // Placeholder for payment service integration
    // Example with Stripe:
    // stripe.redirectToCheckout({
    //     lineItems: [{price: 'price_xxxxx', quantity: 1}],
    //     mode: 'payment',
    //     successUrl: 'https://yourdomain.com/success',
    //     cancelUrl: 'https://yourdomain.com/cancel',
    // });
}
