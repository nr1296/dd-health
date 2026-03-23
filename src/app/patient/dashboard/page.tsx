import { prisma } from "@/lib/prisma";
import { requirePatient } from "@/lib/session";
import Link from "next/link";

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0][0];
  return (
    <div className="w-14 h-14 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
      <span className="text-white font-semibold text-lg">{initials.toUpperCase()}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-teal-50 text-teal-700 border border-teal-200",
    PENDING:   "bg-amber-50 text-amber-700 border border-amber-200",
    COMPLETED: "bg-slate-100 text-slate-600 border border-slate-200",
    CANCELLED: "bg-red-50 text-red-600 border border-red-200",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status] ?? styles.PENDING}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

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

  const upcoming = appointments.filter(
    (a) => a.status === "CONFIRMED" || a.status === "PENDING"
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">

      {/* Upcoming appointments */}
      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Upcoming Sessions
          </h2>
          <div className="flex flex-col gap-3">
            {upcoming.map((appt) => (
              <div key={appt.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <Initials name={appt.provider.name} />
                  <div>
                    <p className="font-semibold text-slate-900">{appt.provider.name}</p>
                    {appt.provider.specialty && (
                      <p className="text-sm text-teal-600 mt-0.5">{appt.provider.specialty}</p>
                    )}
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(appt.scheduledAt).toLocaleString("en-US", {
                        weekday: "short", month: "short", day: "numeric",
                        hour: "numeric", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={appt.status} />
                  {appt.videoRoomUrl && (
                    <a
                      href={`/session/${appt.id}`}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Join Session
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Provider list */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Available Providers
        </h2>

        {providers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-400 text-sm">No providers available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:border-teal-300 transition-colors">
                <div className="flex items-start gap-4">
                  <Initials name={provider.name} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                    {provider.specialty && (
                      <p className="text-sm text-teal-600 mt-0.5">{provider.specialty}</p>
                    )}
                  </div>
                </div>

                {provider.bio && (
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {provider.bio}
                  </p>
                )}

                <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                    Accepting patients
                  </span>
                  <Link
                    href={`/patient/book/${provider.id}`}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
