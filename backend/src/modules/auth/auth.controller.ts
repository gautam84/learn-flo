import { Request, Response } from 'express';
import { hashPassword, comparePasswords, generateToken } from './auth.utils';
import { prisma } from '../../lib/prisma';
import { compare } from 'bcryptjs';
import { z } from 'zod';


export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required." })
          .email("Please enter a valid email address."),
  password: z.string({ required_error: "Password is required." }),
});

export const registerSchema = z.object({
  username: z.string({ required_error: "Username is required." })
             .min(3, "Username must be at least 3 characters long.")
             .max(20, "Username must be at most 20 characters long.")
             .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  email: z.string({ required_error: "Email is required." })
          .email("Please enter a valid email address."),
  password: z.string({ required_error: "Password is required." })
            .min(6, "Password must be at least 6 characters long."),
  role: z.enum(['STUDENT', 'TEACHER'], {
    errorMap: () => ({ message: "Role must be either STUDENT or TEACHER." }),
  }),
});

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Request body is missing or invalid.' });
    }

    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.errors[0].message,
        // data: result.error.errors.map(issue => issue.message),
      });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: "User doesn't exist." });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const token = generateToken({
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};



export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Request body is missing or invalid.',
      });
    }

    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.errors[0].message,
      });
    }

    const { username, email, password, role } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists.',
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    const token = generateToken({
      id: newUser.id.toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};


export const logout = (req: Request, res: Response): any  => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: 'No active session found.' });
  }


  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure cookie in production
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};