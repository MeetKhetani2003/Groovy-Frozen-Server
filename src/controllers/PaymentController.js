import crypto from 'crypto';

import { instance } from '../index.js';

export const checkOut = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR'
    };

    const order = await instance.orders.create(options);

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    console.log('MetaData', req.body, 'Body', req.body.metadata);

    // Validate request body
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required parameters' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest('hex');

    // Verify signature
    const isAuthenticated = expectedSignature === razorpay_signature;

    if (isAuthenticated) {
      // If verification is successful, redirect to the success page
      res.redirect(
        `https://groovy-frozen-self.vercel.app/success?reference=${razorpay_payment_id}`
      );
    } else {
      res
        .status(400)
        .json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.log('Error verifying payment:', error);
    res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
};
