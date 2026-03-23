import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 px-6 py-3.5 flex items-center justify-between">
        <Link href="/patient/dashboard" className="font-semibold text-white tracking-tight">
          DD Health
        </Link>
        <UserButton
          appearance={{
            elements: { avatarBox: "w-8 h-8" },
          }}
        />
      </nav>
      {children}
    </div>
  );
}
