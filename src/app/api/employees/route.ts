import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");
  const position = searchParams.get("position");
  const isActive = searchParams.get("isActive");
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "1";

  // Mock data
  let employees = [
    { id: "1", employeeNumber: "EMP-0001", firstName: "Ahmed", lastName: "Benali", position: "Infirmier", department: "Urgences", phone: "0600000001", hireDate: "2021-01-15", isActive: true },
    { id: "2", employeeNumber: "EMP-0002", firstName: "Fatima", lastName: "Zahra", position: "Médecin", department: "Cardiologie", phone: "0600000002", hireDate: "2020-11-01", isActive: true },
  ];

  if (department) employees = employees.filter(e => e.department === department);
  if (position) employees = employees.filter(e => e.position === position);
  if (isActive) employees = employees.filter(e => e.isActive === (isActive === "true"));
  if (search) {
    const s = search.toLowerCase();
    employees = employees.filter(e => e.firstName.toLowerCase().includes(s) || e.lastName.toLowerCase().includes(s) || e.employeeNumber.toLowerCase().includes(s));
  }

  return NextResponse.json({
    data: employees,
    meta: {
      total: employees.length,
      page: parseInt(page),
      limit: 10,
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real scenario, we would validate with Zod here
    // import { employeeSchema } from "@/lib/validations"
    // const parsed = employeeSchema.parse(body)

    const newEmployee = {
      id: Math.random().toString(36).substring(7),
      employeeNumber: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
