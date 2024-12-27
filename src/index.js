import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import Razorpay from 'razorpay';

import { connectDB } from './configs/dbConfig.js';
import { VariablesConfig } from './configs/variablesConfig.js';
import { initPassport } from './middlewares/passport.js';
import apiRouter from './routers/apiRouter.js';

const app = express();

initPassport(app);
app.use(cors());
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET
});
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(VariablesConfig.PORT, () => {
  console.log(`Server running on port ${VariablesConfig.PORT}`);
  connectDB();
});

export default app;
