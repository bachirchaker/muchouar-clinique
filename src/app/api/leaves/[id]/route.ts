import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { status, managerNotes } = body;
    
    // Update the leave request status in database
    
    return NextResponse.json({ 
      id, 
      status, 
      managerNotes, 
      updatedAt: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
