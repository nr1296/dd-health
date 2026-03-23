import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create room");
  }

  const room = await res.json();
  return room.url as string;
}

async function main() {
  const appointments = await prisma.appointment.findMany({
    where: { videoRoomUrl: null },
  });

  console.log(`Found ${appointments.length} appointments without a video room.`);

  for (const appt of appointments) {
    try {
      const url = await createDailyRoom(appt.id);
      await prisma.appointment.update({
        where: { id: appt.id },
        data: { videoRoomUrl: url },
      });
      console.log(`✓ ${appt.id} → ${url}`);
    } catch (e) {
      console.error(`✗ ${appt.id}: ${e}`);
    }
  }

  await prisma.$disconnect();
}

main();
