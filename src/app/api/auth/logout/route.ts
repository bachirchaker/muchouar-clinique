import { NextResponse } from 'next/server';
import { destroySession, getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function POST() {
  try {
    const session = await getSession();
    if (session) {
      await createAuditLog(session.userId, 'USER_LOGOUT', 'Utilisateur déconnecté', 'USER', session.userId);
    }
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
