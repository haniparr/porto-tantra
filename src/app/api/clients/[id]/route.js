import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth-helpers";
import { z } from "zod";

const updateClientSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  logo: z.string().url().nullable().optional(),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export async function PUT(req, { params }) {
  try {
    await requireRole(["ADMIN", "EDITOR"]);

    const { id } = await params;
    const body = await req.json();
    const data = updateClientSchema.parse(body);

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
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireRole(["ADMIN"]);

    const { id } = await params;

    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 },
    );
  }
}
