import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthedUser } from "@/lib/session";
import VideoSession from "./VideoSession";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  const { userId } = await getAuthedUser();

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { provider: true },
  });

  if (!appointment || !appointment.videoRoomUrl) {
    redirect("/dashboard");
  }

  // Only the patient or the provider can access this session
  const isPatient = appointment.patientClerkId === userId;
  const isProvider = appointment.provider.clerkUserId === userId;
  if (!isPatient && !isProvider) redirect("/dashboard");

  return (
    <VideoSession
      roomUrl={appointment.videoRoomUrl}
      providerName={appointment.provider.name}
      scheduledAt={appointment.scheduledAt.toISOString()}
    />
  );
}
