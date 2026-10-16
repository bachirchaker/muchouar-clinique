import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Mock employee data
  const employee = {
    id,
    employeeNumber: "EMP-0001",
    firstName: "Ahmed",
    lastName: "Benali",
    position: "Infirmier",
    department: "Urgences",
    phone: "0600000001",
    email: "ahmed.benali@clinique.ma",
    hireDate: "2021-01-15",
    isActive: true,
    salary: 8000,
  };

  if (id === "not-found") {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(employee);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await request.json();
    
    // Validate data and update in database
    const updatedEmployee = {
      id,
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  
  // Soft delete in database
  
  return NextResponse.json({ message: "Employee successfully deleted (soft delete)", id });
}
