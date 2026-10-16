import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { consultationSchema } from "@/lib/validations/consultation";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, user: { select: { lastName: true } } } }
        },
        orderBy: { date: "desc" },
        skip,
        take: limit
      }),
      prisma.consultation.count({ where })
    ]);

    return NextResponse.json(
      successResponse(consultations, "Consultations récupérées", {
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
      })
    );
  } catch (error) {
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });

    const body = await request.json();
    const validatedData = consultationSchema.parse(body);

    const consultation = await prisma.consultation.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
      }
    });

    return NextResponse.json(successResponse(consultation, "Consultation créée", null, 201), { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") return NextResponse.json(errorResponse("Données invalides", 400, error.errors), { status: 400 });
    return NextResponse.json(errorResponse("Erreur serveur"), { status: 500 });
  }
}
