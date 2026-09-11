import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim().replace(/^["']|["']$/g, '');
  if (!secret) {
    return 'Q2xhdmVTZWNyZXRhTXV5U2VndXJhUGFyYUxhQ29uY2VzaW9uYXJpYURlTWlBbWlnbzIwMjQ=';
  }
  return secret;
}

export interface TokenPayload {
  userId: number;
  username: string;
  nombreCompleto: string;
  rol: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '4h' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getSessionFromRequest(request: NextRequest): TokenPayload | null {
  const token =
    request.cookies.get('session_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return verifyToken(token);
}
