import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';
import { createAuditLog, getRequestMeta } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        employee: {
          select: {
            id: true,
            employeeNumber: true,
            position: true,
            department: true,
          },
        },
      },
    });

    if (!user) {
      return notFoundResponse('Utilisateur');
    }

    return successResponse(user);
  } catch (error) {
    console.error('User GET error:', error);
    return errorResponse('Erreur lors du chargement', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('Utilisateur');
    }

    const updateData: Record<string, unknown> = {};
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.role) updateData.role = body.role;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.email) {
      const emailExists = await prisma.user.findFirst({
        where: { email: body.email, NOT: { id } },
      });
      if (emailExists) {
        return errorResponse('Cet email est déjà utilisé', 409);
      }
      updateData.email = body.email;
    }
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    const meta = getRequestMeta(request.headers);
    await createAuditLog({
      action: 'UPDATE',
      module: 'users',
      entityId: id,
      entityType: 'User',
      details: { changes: Object.keys(updateData) },
      ...meta,
    });

    return successResponse(user, 'Utilisateur mis à jour');
  } catch (error) {
    console.error('User PUT error:', error);
    return errorResponse('Erreur lors de la mise à jour', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('Utilisateur');
    }

    // Soft delete
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    const meta = getRequestMeta(request.headers);
    await createAuditLog({
      action: 'DELETE',
      module: 'users',
      entityId: id,
      entityType: 'User',
      details: { email: existing.email },
      ...meta,
    });

    return successResponse(null, 'Utilisateur désactivé');
  } catch (error) {
    console.error('User DELETE error:', error);
    return errorResponse('Erreur lors de la suppression', 500);
  }
}
