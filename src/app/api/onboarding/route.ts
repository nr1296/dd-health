import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api";

export const POST = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();
  if (role !== "patient" && role !== "provider") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role, onboardingComplete: true },
  });

  return NextResponse.json({ success: true });
});
