import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const insurances = await prisma.insurance.findMany({
      orderBy: { name: "asc" }
    });

    return NextResponse.json(successResponse(insurances));
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const body = await request.json();
    const insurance = await prisma.insurance.create({
      data: body
    });

    return NextResponse.json(successResponse(insurance, "Assurance créée", null, 201), { status: 201 });
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}
