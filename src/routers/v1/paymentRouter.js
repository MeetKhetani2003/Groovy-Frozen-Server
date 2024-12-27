import express from 'express';

import {
  checkOut,
  paymentVerification
} from '../../controllers/PaymentController.js';

const app = express.Router();

// app.post('/create',  createProductController);
app.post('/checkout', checkOut);
app.post('/payment-verify', paymentVerification);

export default app;
