// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): any  => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

//   console.log('Token:', token); // Debugging line to check the token
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided. Unauthorized.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!); // make sure JWT_SECRET is defined in env
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
