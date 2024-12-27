import jwt from 'jsonwebtoken';

import { VariablesConfig } from '../../configs/variablesConfig.js';

export const generateToken = (data) => {
  // Convert Mongoose document to plain object
  const plainData = data.toObject ? data.toObject() : data;

  // Ensure the data is a plain object
  if (
    plainData === null ||
    typeof plainData !== 'object' ||
    Array.isArray(plainData)
  ) {
    throw new Error('Expected payload to be a plain object');
  }

  // Log the data to debug
  console.log('Data for token generation:', plainData);

  // Generate the token
  const token = jwt.sign(plainData, VariablesConfig.JWT_SECRET, {
    expiresIn: '1d'
  });
  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, VariablesConfig.JWT_SECRET);
};

export const generateResetPasswordToken = (email) => {
  try {
    const payload = { email }; // Only email is necessary for password reset
    const token = jwt.sign(payload, VariablesConfig.JWT_SECRET, {
      expiresIn: '15m' // Short expiration for reset password token
    });

    return token;
  } catch (error) {
    throw new Error('Error generating reset password token', error);
  }
};
export const verifyResetPasswordToken = (token) => {
  try {
    const decoded = jwt.verify(token, VariablesConfig.JWT_SECRET);
    return decoded; // Returns the decoded payload if the token is valid
  } catch (error) {
    throw new Error('Invalid or expired reset password token', error);
  }
};
