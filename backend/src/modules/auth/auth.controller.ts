import { Request, Response } from 'express';
import { hashPassword, comparePasswords, generateToken } from './auth.utils';

const fakeUserDB: { [email: string]: { id: string; email: string; passwordHash: string } } = {};


export const register = async (req: Request, res: Response) : Promise<any> =>{
  const { email, password } = req.body;
  if (fakeUserDB[email]) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const passwordHash = await hashPassword(password);
  const id = Date.now().toString();
  fakeUserDB[email] = { id, email, passwordHash };

  const token = generateToken(id);
  return res.status(201).json({ token });
};

export const login = async (req: Request, res: Response): Promise<any>  => {
  const { email, password } = req.body;
  const user = fakeUserDB[email];
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await comparePasswords(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user.id);
  return res.status(200).json({ token });
};


