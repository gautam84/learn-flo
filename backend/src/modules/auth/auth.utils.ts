import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../types';

const JWT_SECRET = process.env.JWT_SECRET!;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (user: User) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
};
