import { cookies } from 'next/headers';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { createAuditLog } from './audit';
import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback_secret_muchouar_2026';
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '86400', 10); // 24 hours

export async function authenticate(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  
  return user;
}

function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64');
  return `${data}.${signature}`;
}

function verifyToken(token) {
  try {
    const [data, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64');
    
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    if (payload.exp < Date.now()) return null;
    
    return payload;
  } catch (e) {
    return null;
  }
}

export async function createSession(userId, role) {
  const payload = {
    userId,
    role,
    exp: Date.now() + (SESSION_MAX_AGE * 1000)
  };
  
  const token = signToken(payload);
  
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });
}

export async function destroySession() {
  cookies().delete('session');
}

export async function getSession() {
  const sessionToken = cookies().get('session')?.value;
  if (!sessionToken) return null;
  
  return verifyToken(sessionToken);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      employee: {
        include: {
          doctor: true,
          nurse: true
        }
      }
    }
  });
  
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Non autorisé');
  }
  return user;
}

export async function requirePermission(role) {
  const user = await requireAuth();
  if (user.role !== role && user.role !== 'ADMIN') {
    throw new Error('Permission refusée');
  }
  return user;
}
