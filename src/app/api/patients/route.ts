import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { patientSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const gender = searchParams.get("gender") || "";
    const bloodGroup = searchParams.get("bloodGroup") || "";
    const isActiveParam = searchParams.get("isActive");
    
    let isActive = true;
    if (isActiveParam === "false") {
      isActive = false;
    } else if (isActiveParam === "all") {
      isActive = undefined as any; // Don't filter by active status
    }

    const skip = (page - 1) * limit;

    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { patientNumber: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (gender) {
      where.gender = gender;
    }

    if (bloodGroup) {
      where.bloodGroup = bloodGroup;
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.count({ where }),
    ]);

    return NextResponse.json(
      successResponse(
        {
          data: patients,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        "Patients récupérés avec succès"
      )
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error);
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = patientSchema.parse(body);

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    
    const latestPatient = await prisma.patient.findFirst({
      where: {
        patientNumber: {
          startsWith: `PAT-${dateStr}-`,
        },
      },
      orderBy: {
        patientNumber: "desc",
      },
    });

    let sequence = 1;
    if (latestPatient && latestPatient.patientNumber) {
      const parts = latestPatient.patientNumber.split("-");
      if (parts.length === 3) {
        sequence = parseInt(parts[2]) + 1;
      }
    }
    const sequenceStr = sequence.toString().padStart(4, "0");
    const patientNumber = `PAT-${dateStr}-${sequenceStr}`;

    const newPatient = await prisma.patient.create({
      data: {
        ...validatedData,
        patientNumber,
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Patient",
        entityId: newPatient.id,
        details: `Patient créé: ${newPatient.patientNumber}`,
        userId: "system",
      },
    });

    return NextResponse.json(
      successResponse(newPatient, "Patient créé avec succès"),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la création du patient:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(errorResponse("Données invalides", 400, error.errors), {
        status: 400,
      });
    }
    return NextResponse.json(errorResponse("Erreur serveur", 500), { status: 500 });
  }
}
