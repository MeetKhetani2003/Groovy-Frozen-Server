import dotenv from 'dotenv';

dotenv.config();

export const VariablesConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.ENV,
  MONGODB_URL_PROD: process.env.MONGO_DB_PROD_URI,
  MONGODB_URL_DEV: process.env.MONGO_DB_DEV_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  MAIL_ID: process.env.MAIL_ID,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

export const facebook = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL:
    'https://groovy-frozen.onrender.com/api/v1/users/facebook/callback'
};

export const google = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://groovy-frozen.onrender.com/api/v1/users/google/callback'
};
