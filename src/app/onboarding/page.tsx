"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState<"patient" | "provider" | null>(null);
  const [error, setError] = useState("");

  async function selectRole(role: "patient" | "provider") {
    setLoading(role);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save role");
      }
      // Full page reload so the session token refreshes with new metadata
      window.location.href = role === "provider" ? "/provider/dashboard" : "/patient/dashboard";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Welcome</h1>
        <p className="text-slate-600 text-center mb-10">How will you be using this platform?</p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => selectRole("patient")}
            disabled={loading !== null}
            className="flex flex-col items-center gap-3 p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="text-4xl">🧑‍⚕️</span>
            <span className="font-semibold text-slate-900">I am a Patient</span>
            <span className="text-sm text-slate-500 text-center">Looking for a mental health provider</span>
            {loading === "patient" && <span className="text-sm text-blue-600">Saving...</span>}
          </button>

          <button
            onClick={() => selectRole("provider")}
            disabled={loading !== null}
            className="flex flex-col items-center gap-3 p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="text-4xl">🩺</span>
            <span className="font-semibold text-slate-900">I am a Provider</span>
            <span className="text-sm text-slate-500 text-center">Mental health professional</span>
            {loading === "provider" && <span className="text-sm text-blue-600">Saving...</span>}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
