import express from 'express';
import authRouter from '../modules/auth/auth.route';

const api = express.Router();
api.use('/auth', authRouter);
export default api;