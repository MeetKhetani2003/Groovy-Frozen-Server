import transporter from '../configs/mailerConfig.js';

export async function sendOtpMail({ email, otp }) {
  await transporter.sendMail({
    from: '"Groovy Cafe" <sureshkhetani1111@gmail.com>',
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
  });
}
// async function sendMail() {
//   const info = await transporter.sendMail({
//     from: '"Meet Khetani" <sureshkhetani1111@gmail.com>', // sender address
//     to: 'meetkhetani1111@gmail.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world?',
//     html: '<b>Hello world?</b>'
//   });

//   console.log('Message sent: %s', info.messageId);
// }
// sendMail().catch(console.error);
