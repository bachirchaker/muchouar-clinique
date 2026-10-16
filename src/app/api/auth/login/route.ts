import { NextResponse } from 'next/server';
import { authenticate, createSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    
    const { email, password } = result.data;
    const user = await authenticate(email, password);
    
    if (!user) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }
    
    await createSession(user.id, user.role);
    await createAuditLog(user.id, 'USER_LOGIN', 'Utilisateur connecté avec succès', 'USER', user.id);
    
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
