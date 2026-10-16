import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");
  const availability = searchParams.get("availability"); // "today", "tomorrow", etc.

  // Mock data joining employee and doctor info
  let doctors = [
    {
      id: "doc-1",
      employeeId: "2",
      specialty: "Cardiologie",
      consultationFee: 400,
      availability: ["Monday", "Wednesday", "Friday"],
      employee: {
        firstName: "Fatima",
        lastName: "Zahra",
        phone: "0600000002",
        isActive: true,
      }
    },
    {
      id: "doc-2",
      employeeId: "3",
      specialty: "Neurologie",
      consultationFee: 450,
      availability: ["Tuesday", "Thursday"],
      employee: {
        firstName: "Karim",
        lastName: "Tazi",
        phone: "0600000003",
        isActive: true,
      }
    }
  ];

  if (specialty) {
    doctors = doctors.filter(d => d.specialty === specialty);
  }

  // Assuming availability is simplified
  if (availability) {
    // Filter logic based on actual dates or days
  }

  return NextResponse.json({ data: doctors });
}
