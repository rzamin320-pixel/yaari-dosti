const express = require('express');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

const router = express.Router();

router.post('/create-checkout-session', auth, async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    return res.status(500).json({ message: 'Stripe is not configured yet' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: 'http://localhost:3000/subscribe/success',
      cancel_url: 'http://localhost:3000/subscribe/cancel',
      customer_email: req.user.email
    });
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Stripe session creation failed' });
  }
});

module.exports = router;
