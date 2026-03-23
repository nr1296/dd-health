import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "DD Health <onboarding@resend.dev>";

export async function sendBookingConfirmation({
  patientEmail,
  providerEmail,
  providerName,
  scheduledAt,
  sessionUrl,
}: {
  patientEmail: string;
  providerEmail: string;
  providerName: string;
  scheduledAt: Date;
  sessionUrl: string;
}) {
  const formattedDate = scheduledAt.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: patientEmail,
      subject: `Appointment confirmed with ${providerName}`,
      html: `
        <p>Your appointment has been confirmed.</p>
        <p><strong>Provider:</strong> ${providerName}<br/>
        <strong>Date:</strong> ${formattedDate}</p>
        <p><a href="${sessionUrl}">Join your session</a></p>
        <p>You can also find this link on your dashboard at any time.</p>
      `,
    }),
    resend.emails.send({
      from: FROM,
      to: providerEmail,
      subject: `New appointment booked`,
      html: `
        <p>A patient has booked an appointment with you.</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><a href="${sessionUrl}">Join the session</a></p>
        <p>You can also find this link on your dashboard.</p>
      `,
    }),
  ]);
}
