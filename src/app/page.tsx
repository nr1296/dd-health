import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="max-w-lg w-full mx-4 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">DD Health</h1>
        <p className="text-slate-500 text-lg mb-10">
          Mental health support for people living with diabetes.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
