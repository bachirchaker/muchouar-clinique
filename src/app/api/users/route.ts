import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, paginatedResponse, parsePaginationParams } from '@/lib/api-response';
import { userSchema } from '@/lib/validations';
import { createAuditLog, getRequestMeta } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = parsePaginationParams(searchParams);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const isActive = searchParams.get('isActive');

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return paginatedResponse(users, total, page, pageSize);
  } catch (error) {
    console.error('Users GET error:', error);
    return errorResponse('Erreur lors du chargement des utilisateurs', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.errors.map((e) => e.message).join(', '),
        422
      );
    }

    const data = validation.data;

    // Check email uniqueness
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return errorResponse('Un utilisateur avec cet email existe déjà', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Audit log
    const meta = getRequestMeta(request.headers);
    await createAuditLog({
      action: 'CREATE',
      module: 'users',
      entityId: user.id,
      entityType: 'User',
      details: { email: user.email, role: user.role },
      ...meta,
    });

    return successResponse(user, 'Utilisateur créé avec succès', 201);
  } catch (error) {
    console.error('Users POST error:', error);
    return errorResponse('Erreur lors de la création de l\'utilisateur', 500);
  }
}
