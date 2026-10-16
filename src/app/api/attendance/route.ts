import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const employeeId = searchParams.get("employeeId");

  let records = [
    {
      id: "att-1",
      employeeId: "1",
      employeeName: "Ahmed Benali",
      date: new Date().toISOString().split('T')[0],
      checkIn: "08:00",
      checkOut: "16:00",
      status: "Présent",
      lateMinutes: 0,
      overtimeMinutes: 0
    },
    {
      id: "att-2",
      employeeId: "2",
      employeeName: "Fatima Zahra",
      date: new Date().toISOString().split('T')[0],
      checkIn: "08:15",
      checkOut: null,
      status: "Retard",
      lateMinutes: 15,
      overtimeMinutes: 0
    }
  ];

  if (employeeId) {
    records = records.filter(r => r.employeeId === employeeId);
  }

  return NextResponse.json({ data: records });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, type, timestamp } = body; // type: "check-in" or "check-out"

    // Process logic here

    return NextResponse.json({ message: `Successfully recorded ${type}`, employeeId, timestamp }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
