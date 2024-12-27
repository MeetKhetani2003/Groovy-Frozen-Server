import mongoose from 'mongoose';

import { VariablesConfig } from './variablesConfig.js';

const DBURI =
  VariablesConfig.NODE_ENV === 'developement'
    ? VariablesConfig.MONGODB_URL_DEV
    : VariablesConfig.MONGODB_URL_PROD;
export const connectDB = async () => {
  try {
    await mongoose.connect(DBURI);
  } catch (error) {
    throw new Error('Error Occured while connecting to MongoDB', error);
  }
};
