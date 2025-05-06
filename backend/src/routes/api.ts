import express from 'express';
import authRouter from '../modules/auth/auth.route';
import classroomsRouter from '../modules/classrooms/classrooms.route';
import { verifyToken } from '../middleware/auth.middleware';

const api = express.Router();
api.use('/auth', authRouter);

// Apply auth middleware to all classrooms routes
api.use('/classrooms', verifyToken);
api.use('/classrooms', classroomsRouter);

export default api;