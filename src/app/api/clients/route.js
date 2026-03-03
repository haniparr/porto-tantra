import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth-helpers";
import { z } from "zod";

const createClientSchema = z.object({
  name: z.string().min(1).max(255),
  logo: z.string().url().nullable().optional(),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await requireRole(["ADMIN", "EDITOR"]);

    const body = await req.json();
    const data = createClientSchema.parse(body);

    const client = await prisma.client.create({
      data: {
        name: data.name,
        logo: data.logo || null,
        order: data.order || 0,
        published: data.published ?? true,
      },
    });

    return NextResponse.json(client, { status: 201 });
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
      { error: "Failed to create client" },
      { status: 500 },
    );
  }
}
