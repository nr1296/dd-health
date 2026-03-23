import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api";

async function createDailyRoom(appointmentId: string): Promise<string> {
  const res = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: `appt-${appointmentId}`,
      properties: {
        enable_chat: false,
        start_video_off: false,
        start_audio_off: false,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create video room");
  }

  const room = await res.json();
  return room.url as string;
}

export const POST = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { providerId, scheduledAt } = await req.json();
  if (!providerId || !scheduledAt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const provider = await prisma.provider.findUnique({ where: { id: providerId } });
  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      providerId,
      patientClerkId: userId,
      scheduledAt: new Date(scheduledAt),
      status: "CONFIRMED",
    },
  });

  const videoRoomUrl = await createDailyRoom(appointment.id);

  const updated = await prisma.appointment.update({
    where: { id: appointment.id },
    data: { videoRoomUrl },
  });

  return NextResponse.json({ appointment: updated });
});
