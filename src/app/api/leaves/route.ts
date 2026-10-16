import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // pending, approved, rejected
  const employeeId = searchParams.get("employeeId");

  let leaves = [
    {
      id: "leave-1",
      employeeId: "1",
      employeeName: "Ahmed Benali",
      type: "Congé Annuel",
      startDate: "2023-08-01",
      endDate: "2023-08-15",
      days: 14,
      status: "approved"
    },
    {
      id: "leave-2",
      employeeId: "2",
      employeeName: "Fatima Zahra",
      type: "Maladie",
      startDate: "2023-10-01",
      endDate: "2023-10-03",
      days: 3,
      status: "pending"
    }
  ];

  if (status) leaves = leaves.filter(l => l.status === status);
  if (employeeId) leaves = leaves.filter(l => l.employeeId === employeeId);

  return NextResponse.json({ data: leaves });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newLeave = {
      id: `leave-${Date.now()}`,
      status: "pending",
      ...body,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(newLeave, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
