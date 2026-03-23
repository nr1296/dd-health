"use client";

import { useEffect, useRef, useState } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";

type Props = {
  roomUrl: string;
  providerName: string;
  scheduledAt: string;
};

export default function VideoSession({ roomUrl, providerName, scheduledAt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callRef = useRef<DailyCall | null>(null);
  const [status, setStatus] = useState<"loading" | "joined" | "left">("loading");

  useEffect(() => {
    if (!containerRef.current) return;

    const call = DailyIframe.createFrame(containerRef.current, {
      iframeStyle: {
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "0",
      },
      showLeaveButton: true,
      showFullscreenButton: true,
    });

    callRef.current = call;

    call.join({ url: roomUrl }).then(() => setStatus("joined"));
    call.on("left-meeting", () => setStatus("left"));

    return () => {
      call.destroy();
    };
  }, [roomUrl]);

  if (status === "left") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Session ended</h2>
          <p className="text-slate-400 mb-6">Your session with {providerName} has ended.</p>
          <a
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Back to dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-screen bg-slate-900">
      <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
        <div>
          <p className="text-white font-medium">{providerName}</p>
          <p className="text-slate-400 text-sm">
            {new Date(scheduledAt).toLocaleString()}
          </p>
        </div>
        {status === "loading" && (
          <span className="text-slate-400 text-sm">Connecting...</span>
        )}
      </div>

      <div ref={containerRef} className="flex-1" />
    </main>
  );
}
