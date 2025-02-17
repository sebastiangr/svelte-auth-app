import jwt from 'jsonwebtoken';
import type { SignOptions, Secret } from 'jsonwebtoken';

const SECRET: Secret = import.meta.env.VITE_JWT_SECRET ?? '';
const EXPIRES_IN: string = import.meta.env.VITE_JWT_EXPIRES_IN ? String(import.meta.env.VITE_JWT_EXPIRES_IN) : '2h';

/**
 * @param {string | object} payload
 */
export function generateToken(payload: string | object) {
  if (!SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const options: SignOptions = { expiresIn: '2h' };
  return jwt.sign(payload, SECRET, options);
}

export interface JwtPayload {
  [key: string]: any;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}
