import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/session";

export default async function ProviderDashboard() {
  const { userId } = await requireProvider();

  const provider = await prisma.provider.findUnique({
    where: { clerkUserId: userId },
    include: { appointments: { orderBy: { scheduledAt: "asc" } } },
  });

  if (!provider) redirect("/provider/setup");

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{provider.name}</h1>
        {provider.specialty && (
          <p className="text-slate-500 mt-0.5">{provider.specialty}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl">
        <h2 className="font-semibold text-slate-900 mb-2">Your profile</h2>
        {provider.bio ? (
          <p className="text-slate-600 text-sm">{provider.bio}</p>
        ) : (
          <p className="text-slate-400 text-sm italic">No bio yet.</p>
        )}
      </div>

      <div className="mt-8 max-w-2xl">
        <h2 className="font-semibold text-slate-800 mb-3">Appointments</h2>
        {provider.appointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-slate-400 text-sm italic">No appointments yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {provider.appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-slate-500">
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
        )}
      </div>
    </main>
  );
}
