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
      window.location.href = role === "provider" ? "/provider/dashboard" : "/patient/dashboard";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-teal-400 text-sm font-medium tracking-widest uppercase mb-3">DD Health</p>
          <h1 className="text-3xl font-bold text-white mb-2">How are you joining?</h1>
          <p className="text-slate-400">We'll set up your experience based on your role.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => selectRole("patient")}
            disabled={loading !== null}
            className="flex flex-col gap-3 p-6 bg-slate-800 border-2 border-slate-700 hover:border-teal-500 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-700 group-hover:bg-teal-900 flex items-center justify-center transition-colors">
              <PatientIcon />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">I'm a Patient</p>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">Looking for mental health support</p>
            </div>
            {loading === "patient" && <p className="text-teal-400 text-xs">Setting up...</p>}
          </button>

          <button
            onClick={() => selectRole("provider")}
            disabled={loading !== null}
            className="flex flex-col gap-3 p-6 bg-slate-800 border-2 border-slate-700 hover:border-teal-500 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-700 group-hover:bg-teal-900 flex items-center justify-center transition-colors">
              <ProviderIcon />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">I'm a Provider</p>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">Licensed mental health professional</p>
            </div>
            {loading === "provider" && <p className="text-teal-400 text-xs">Setting up...</p>}
          </button>
        </div>

        {error && (
          <div className="mt-5 p-4 bg-red-900/40 border border-red-700 rounded-xl">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PatientIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ProviderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
      <path d="M12 7v4M10 9h4" />
    </svg>
  );
}
