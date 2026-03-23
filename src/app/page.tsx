import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Nav */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-slate-800">
        <span className="font-semibold text-lg tracking-tight">DD Health</span>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm text-slate-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg font-medium transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto w-full gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
          HIPAA Compliant
        </div>

        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Mental health care built for{" "}
          <span className="text-teal-400">diabetes patients</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
          Connect with licensed mental health professionals who specialize in the
          emotional challenges of living with diabetes. Private, secure, and on your schedule.
        </p>

        <div className="flex items-center gap-4 mt-2">
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-500 rounded-lg font-semibold transition-colors"
          >
            Book your first session
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-3 rounded-lg font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </main>

      {/* Trust bar */}
      <footer className="px-8 py-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
        <span className="flex items-center gap-2">
          <LockIcon /> End-to-end encrypted sessions
        </span>
        <span className="flex items-center gap-2">
          <ShieldIcon /> HIPAA compliant platform
        </span>
        <span className="flex items-center gap-2">
          <CheckIcon /> Vetted, licensed providers
        </span>
      </footer>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
