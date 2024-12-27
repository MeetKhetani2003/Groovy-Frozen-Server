import nodemailer from 'nodemailer';

import { VariablesConfig } from './variablesConfig.js';

export default nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: VariablesConfig.MAIL_ID,
    pass: VariablesConfig.MAIL_PASSWORD
  }
});
