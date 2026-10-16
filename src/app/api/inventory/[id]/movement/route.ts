import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { type, quantity, reason, performedById } = body;

    const item = await prisma.inventoryItem.findUnique({ where: { id: params.id } });
    if (!item) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    let newQuantity = item.quantity;
    if (type === "IN") newQuantity += quantity;
    else if (type === "OUT" || type === "LOSS" || type === "EXPIRY") newQuantity -= quantity;
    else if (type === "ADJUSTMENT") newQuantity = quantity; // Using quantity field as the new exact amount for adjustment

    const movement = await prisma.$transaction([
      prisma.inventoryItem.update({
        where: { id: params.id },
        data: { quantity: newQuantity }
      }),
      prisma.inventoryMovement.create({
        data: {
          inventoryItemId: params.id,
          type,
          quantity: type === "ADJUSTMENT" ? Math.abs(newQuantity - item.quantity) : quantity,
          previousQuantity: item.quantity,
          newQuantity,
          reason,
          performedById: performedById || "system", // Should come from auth session
          date: new Date()
        }
      })
    ]);

    return NextResponse.json(movement[1], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'enregistrement du mouvement" }, { status: 500 });
  }
}
