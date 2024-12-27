import express from 'express';

import v1Router from './v1/v1Router.js';
const app = express.Router();

app.use('/v1', v1Router);

export default app;
