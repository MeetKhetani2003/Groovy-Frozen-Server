import express from 'express';

import cartRouter from './cartRouter.js';
import paymentRouter from './paymentRouter.js';
import productRouter from './productRouter.js';
import userRouter from './userRouter.js';
const app = express.Router();

app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/pay', paymentRouter);
export default app;
