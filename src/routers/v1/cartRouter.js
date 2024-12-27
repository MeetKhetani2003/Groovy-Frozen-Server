import express from 'express';

import {
  addProductToCartController,
  checkoutCartController,
  getCartController
} from '../../controllers/CartController.js';
import { paymentVerification } from '../../controllers/PaymentController.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const app = express.Router();

// app.post('/create',  createProductController);
app.post('/checkout', isAuthenticated, checkoutCartController);
app.post('/payment-verify', paymentVerification);
app.post('/add/:productId', isAuthenticated, addProductToCartController);
app.get('/get/:id', getCartController);

export default app;
