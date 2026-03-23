import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <Link href="/patient/dashboard" className="font-semibold text-slate-900">
          DD Health
        </Link>
        <UserButton />
      </nav>
      {children}
    </div>
  );
}
