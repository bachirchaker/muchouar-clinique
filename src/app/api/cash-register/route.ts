import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const openRegister = await prisma.cashRegisterSession.findFirst({
      where: {
        userId: session.user.id,
        status: "OPEN"
      },
      include: {
        payments: true
      }
    });

    return NextResponse.json(successResponse(openRegister));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const body = await request.json();
    const { openingBalance } = body;

    const existingOpen = await prisma.cashRegisterSession.findFirst({
      where: { userId: session.user.id, status: "OPEN" }
    });

    if (existingOpen) {
      return NextResponse.json(errorResponse("Une caisse est déjà ouverte", 400), { status: 400 });
    }

    const sessionReg = await prisma.cashRegisterSession.create({
      data: {
        userId: session.user.id,
        openingBalance: Number(openingBalance),
        status: "OPEN",
        openedAt: new Date()
      }
    });

    return NextResponse.json(successResponse(sessionReg, "Caisse ouverte avec succès", null, 201), { status: 201 });
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}
