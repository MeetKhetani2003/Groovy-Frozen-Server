import 'dotenv/config';

import session from 'express-session';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';

import {
  facebook,
  google,
  VariablesConfig
} from '../configs/variablesConfig.js';
import { userRepository } from '../repositories/userRepository.js'; // Assume you have a repository for DB operations
import { createCart, updateCartUser } from '../services/cartService.js';
import { generateToken } from '../utils/commons/jwt.js';

export const initPassport = (app) => {
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: VariablesConfig.JWT_SECRET
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

passport.use(
  new FacebookStrategy(
    {
      clientID: facebook.clientID,
      clientSecret: facebook.clientSecret,
      callbackURL: facebook.callbackURL,
      profileFields: ['id', 'emails', 'name', 'picture.type(large)']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const formattedProfile = formatFB(profile._json);
        const user = await findOrCreateUser(formattedProfile);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    google,
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const formattedProfile = formatGoogle(profile._json);
        const user = await findOrCreateUser(formattedProfile); // Handle DB logic

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

const formatGoogle = (profile) => {
  console.log('profile', profile);

  return {
    username: `${profile.given_name}  ${profile.family_name}`,
    email: profile.email,
    avatar: profile.picture,
    signedUpVia: 'google'
  };
};

const formatFB = (profile) => {
  return {
    username: `${profile.first_name}  ${profile.last_name}`,
    email: profile.email,
    avatar: profile.picture.data.url
      ? profile.picture.data.url
      : `https://robohash.org/${profile.first_name + profile.last_name}`,
    signedUpVia: 'facebook'
  };
};

const findOrCreateUser = async (profile) => {
  const existingUser = await userRepository.getOne({ email: profile.email });
  if (existingUser) {
    await generateToken(existingUser);
    return existingUser;
  }
  const newCart = await createCart();
  profile.cart = newCart._id;
  const newUser = await userRepository.create({
    ...profile,
    cart: newCart._id
  });
  await updateCartUser(newCart._id, { userId: newUser._id });
  return newUser;
};
