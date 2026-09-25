"use client";

import { useEffect, useState } from "react";

type UpdateStatus =
  | "unknown"
  | "checking"
  | "up-to-date"
  | "installing-dependencies"
  | "updated"
  | "restarting";

interface StatusResponse {
  status: UpdateStatus;
  appliedAt?: string;
}

const POLL_MS = 20_000;
const SEEN_UPDATE_KEY = "cms-last-seen-update";

export default function UpdateBanner() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [restarting, setRestarting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/trigger-update-check", { method: "POST" }).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch("/api/admin/update-status", { cache: "no-store" });
        if (res.ok) {
          const data: StatusResponse = await res.json();
          if (!cancelled) setStatus(data);
        }
      } catch {
        // Netzwerkproblem - beim naechsten Poll weiter versuchen.
      } finally {
        if (!cancelled) timer = setTimeout(poll, POLL_MS);
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  async function handleRestart() {
    setRestarting(true);
    try {
      await fetch("/api/admin/trigger-restart", { method: "POST" });
    } catch {
      setRestarting(false);
      return;
    }
    // Warte bis der Server wieder antwortet (max. 90s) - Next.js Dev-Server
    // braucht nach SIGTERM + Neustart typisch 15-30s bis er HTTP serviert.
    // Ein fixer Timeout wuerde die Seite laden, bevor der Server bereit ist.
    for (let i = 0; i < 90; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await fetch("/api/admin/update-status", {
          cache: "no-store",
          signal: AbortSignal.timeout(2000),
        });
        if (res.ok) {
          window.location.reload();
          return;
        }
      } catch {
        // Server noch nicht bereit - weiter warten.
      }
    }
    // Timeout abgelaufen, trotzdem versuchen.
    window.location.reload();
  }

  if (!status) return null;

  if (status.status === "restarting" || restarting) {
    return (
      <div className="border-b border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-center text-sm text-blue-400 sm:px-6">
        CMS wird neu gestartet, einen Moment bitte…
      </div>
    );
  }

  if (status.status === "installing-dependencies") {
    return (
      <div className="border-b border-accent/30 bg-accent/10 px-4 py-2.5 text-center text-sm text-accent-text sm:px-6">
        Ein Update wird im Hintergrund vorbereitet…
      </div>
    );
  }

  if (status.status === "updated" && status.appliedAt) {
    const alreadySeen =
      typeof window !== "undefined" && localStorage.getItem(SEEN_UPDATE_KEY) === status.appliedAt;
    if (alreadySeen) return null;
    try {
      localStorage.setItem(SEEN_UPDATE_KEY, status.appliedAt);
    } catch {
      // localStorage nicht verfuegbar - kein Problem.
    }
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400 sm:px-6">
        <span>Ein Update wurde installiert.</span>
        <button
          onClick={handleRestart}
          disabled={restarting}
          className="rounded bg-emerald-500/20 px-3 py-1 font-medium hover:bg-emerald-500/30 disabled:opacity-50"
        >
          Jetzt neu starten
        </button>
      </div>
    );
  }

  return null;
}
