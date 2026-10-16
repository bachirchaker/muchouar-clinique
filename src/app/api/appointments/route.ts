import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { appointmentSchema } from "@/lib/validations/appointment";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { patient: { firstName: { contains: search } } },
        { patient: { lastName: { contains: search } } },
        { reason: { contains: search } }
      ];
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true, phone: true }
          },
          doctor: {
            select: { id: true, user: { select: { firstName: true, lastName: true, email: true } }, specialty: true }
          }
        },
        orderBy: { date: "desc" },
        skip,
        take: limit
      }),
      prisma.appointment.count({ where })
    ]);

    return NextResponse.json(
      successResponse(appointments, "Rendez-vous récupérés avec succès", {
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      })
    );
  } catch (error: any) {
    console.error("GET /api/appointments Error:", error);
    return NextResponse.json(errorResponse("Erreur lors de la récupération des rendez-vous"), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(errorResponse("Non autorisé", 401), { status: 401 });
    }

    const body = await request.json();
    const validatedData = appointmentSchema.parse(body);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: validatedData.patientId,
        doctorId: validatedData.doctorId,
        date: new Date(validatedData.date),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        reason: validatedData.reason,
        type: validatedData.type,
        status: "PENDING",
        notes: validatedData.notes
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { user: { select: { firstName: true, lastName: true } } } }
      }
    });

    // Audit logging
    await prisma.auditLog.create({
      data: {
        action: "CREATE_APPOINTMENT",
        entity: "APPOINTMENT",
        entityId: appointment.id,
        userId: session.user.id,
        details: `Création du rendez-vous pour ${appointment.patient.firstName} ${appointment.patient.lastName}`
      }
    });

    return NextResponse.json(successResponse(appointment, "Rendez-vous créé avec succès", null, 201), { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(errorResponse("Données invalides", 400, error.errors), { status: 400 });
    }
    console.error("POST /api/appointments Error:", error);
    return NextResponse.json(errorResponse("Erreur lors de la création du rendez-vous"), { status: 500 });
  }
}
