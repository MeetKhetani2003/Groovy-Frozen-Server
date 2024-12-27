import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import { cloudinaryInstance } from './cloudinaryConfig.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryInstance,
  params: {
    folder: 'FrozenFood-Imgs', // Folder in Cloudinary
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'] // Supported formats
  }
});

const upload = multer({ storage: storage });

export default upload;
