import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePatient } from "@/lib/session";
import BookingForm from "./BookingForm";

export default async function BookPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = await params;
  await requirePatient();

  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    select: { id: true, name: true, specialty: true, bio: true },
  });

  if (!provider) notFound();

  return <BookingForm provider={provider} />;
}
