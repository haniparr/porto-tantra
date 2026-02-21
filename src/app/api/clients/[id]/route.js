import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const client = await prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo,
        order: data.order,
        published: data.published,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 },
    );
  }
}
