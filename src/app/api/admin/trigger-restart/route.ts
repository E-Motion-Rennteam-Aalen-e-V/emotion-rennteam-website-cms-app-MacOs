import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getSessionUser } from "@/lib/cms/auth";

// Wird von UpdateBanner.tsx aufgerufen, wenn die Redaktion nach einem Update
// auf "Jetzt neu starten" klickt. Legt eine Markerdatei an, die
// scripts/cms-supervisor.mjs abpollt und daraufhin den Next.js-Server
// graceful neu startet, sodass der neue Code aktiv wird - ohne dass die
// Redaktion die App manuell schliessen und neu oeffnen muss.
const RESTART_TRIGGER_FILE = path.join(process.cwd(), ".cms-restart-trigger");

export async function POST(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  try {
    await fs.writeFile(RESTART_TRIGGER_FILE, new Date().toISOString());
  } catch {
    // Kein laufender Supervisor - kein Fehlerfall, einfach nichts passiert.
  }
  return NextResponse.json({ ok: true });
}
