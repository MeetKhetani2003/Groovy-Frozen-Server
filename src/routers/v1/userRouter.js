import express from 'express';
import passport from 'passport';

import {
  forgotPasswordController,
  getAllUsersController,
  resetPasswordController,
  signinController,
  signupController,
  updateUserController,
  verifyOtpController
} from '../../controllers/UserController.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { generateToken } from '../../utils/commons/jwt.js';

const app = express.Router();

app.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(
      `https://groovy-frozen-self.vercel.app/facebook/callback?token=${token}&user=${req.user}`
    );
  }
);

app.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(
      `https://groovy-frozen-self.vercel.app/facebook/callback?token=${token}&user=${req.user}`
    );
  }
);
app.post('/signup', signupController);
app.post('/signin', signinController);
app.post('/forgot-password', forgotPasswordController);
app.post('/verify-otp', verifyOtpController);
app.get('/getall', getAllUsersController);
app.post('/reset-password/:token', resetPasswordController);
app.put('/update', isAuthenticated, updateUserController);
export default app;
