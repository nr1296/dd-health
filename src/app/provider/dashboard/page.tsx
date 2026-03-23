import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/session";

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

export default async function ProviderDashboard() {
  const { userId } = await requireProvider();

  const provider = await prisma.provider.findUnique({
    where: { clerkUserId: userId },
    include: { appointments: { orderBy: { scheduledAt: "asc" } } },
  });

  if (!provider) redirect("/provider/setup");

  const upcoming = provider.appointments.filter(
    (a) => a.status === "CONFIRMED" || a.status === "PENDING"
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">

      {/* Profile card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{provider.name}</h1>
            {provider.specialty && (
              <p className="text-teal-600 text-sm mt-0.5">{provider.specialty}</p>
            )}
          </div>
          <span className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
            Active
          </span>
        </div>
        {provider.bio && (
          <p className="text-slate-500 text-sm mt-4 leading-relaxed">{provider.bio}</p>
        )}
      </div>

      {/* Appointments */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Appointments
        </h2>

        {upcoming.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-400 text-sm">No upcoming appointments.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((appt) => (
              <div key={appt.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="font-medium text-slate-900 text-sm">
                    {new Date(appt.scheduledAt).toLocaleString("en-US", {
                      weekday: "long", month: "short", day: "numeric",
                      hour: "numeric", minute: "2-digit",
                    })}
                  </p>
                  <div className="mt-1.5">
                    <StatusBadge status={appt.status} />
                  </div>
                </div>
                {appt.videoRoomUrl && (
                  <a
                    href={`/session/${appt.id}`}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Join Session
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
