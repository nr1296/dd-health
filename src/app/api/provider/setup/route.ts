import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

export const POST = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, bio, specialty } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const provider = await prisma.provider.upsert({
    where: { clerkUserId: userId },
    update: { name: name.trim(), bio: bio?.trim() ?? null, specialty: specialty?.trim() ?? null },
    create: { clerkUserId: userId, name: name.trim(), bio: bio?.trim() ?? null, specialty: specialty?.trim() ?? null },
  });

  return NextResponse.json({ provider });
});
