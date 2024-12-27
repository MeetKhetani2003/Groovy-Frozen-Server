import cloudinary from 'cloudinary';

import { VariablesConfig } from './variablesConfig.js';

// Configure Cloudinary and export the instance
cloudinary.v2.config({
  cloud_name: VariablesConfig.CLOUD_NAME,
  api_key: VariablesConfig.CLOUDINARY_API_KEY,
  api_secret: VariablesConfig.CLOUDINARY_API_SECRET
});

export const cloudinaryInstance = cloudinary.v2;
