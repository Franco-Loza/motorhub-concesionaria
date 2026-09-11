import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada correctamente' });
  response.cookies.set('session_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
