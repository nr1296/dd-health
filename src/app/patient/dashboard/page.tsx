import { prisma } from "@/lib/prisma";
import { requirePatient } from "@/lib/session";
import Link from "next/link";

export default async function PatientDashboard() {
  const { userId } = await requirePatient();

  const [providers, appointments] = await Promise.all([
    prisma.provider.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.appointment.findMany({
      where: { patientClerkId: userId },
      include: { provider: true },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Find a Provider</h1>

      {/* Upcoming appointments */}
      {appointments.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Your Appointments</h2>
          <div className="flex flex-col gap-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{appt.provider.name}</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {new Date(appt.scheduledAt).toLocaleString()}
                  </p>
                  <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {appt.status}
                  </span>
                </div>
                {appt.videoRoomUrl && (
                  <a
                    href={`/session/${appt.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Join Session
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Provider list */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Available Providers</h2>
        {providers.length === 0 ? (
          <p className="text-slate-400 italic text-sm">No providers available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-3"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                  {provider.specialty && (
                    <p className="text-sm text-blue-600 mt-0.5">{provider.specialty}</p>
                  )}
                  {provider.bio && (
                    <p className="text-sm text-slate-500 mt-2 line-clamp-3">{provider.bio}</p>
                  )}
                </div>
                <Link
                  href={`/patient/book/${provider.id}`}
                  className="mt-auto inline-block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Book Appointment
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
