import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const body = await request.json();
    const { closingBalance } = body;

    const registerSession = await prisma.cashRegisterSession.findUnique({
      where: { id: params.id },
      include: { payments: true }
    });

    if (!registerSession) return NextResponse.json(errorResponse("Session non trouvée", 404), { status: 404 });
    if (registerSession.status === "CLOSED") return NextResponse.json(errorResponse("Caisse déjà fermée", 400), { status: 400 });

    const totalIncome = registerSession.payments.reduce((acc, p) => acc + Number(p.amount), 0);
    const expectedBalance = Number(registerSession.openingBalance) + totalIncome;
    const difference = Number(closingBalance) - expectedBalance;

    const closedSession = await prisma.cashRegisterSession.update({
      where: { id: params.id },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
        closingBalance: Number(closingBalance),
        expectedBalance,
        difference
      }
    });

    return NextResponse.json(successResponse(closedSession, "Caisse fermée avec succès"));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}
