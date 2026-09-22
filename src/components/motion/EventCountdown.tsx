"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calcTimeLeft(eventDate: Date): TimeLeft | null {
  const diff = eventDate.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function EventCountdown({
  eventName,
  eventDate,
}: {
  eventName: string;
  eventDate: Date;
}) {
  // undefined = not yet mounted (SSR), null = event over, TimeLeft = counting
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setTimeLeft(calcTimeLeft(eventDate));
    const init = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(init);
      clearInterval(id);
    };
  }, [eventDate]);

  if (timeLeft === undefined) return <div />;

  if (!timeLeft) {
    return (
      <div className="text-center text-2xl font-bold text-foreground">
        Wettbewerb läuft! 🏎️
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: "Tage" },
    { value: timeLeft.hours, label: "Stunden" },
    { value: timeLeft.minutes, label: "Minuten" },
    { value: timeLeft.seconds, label: "Sekunden" },
  ];

  return (
    <div>
      <p className="mb-4 text-center text-sm text-muted">
        Countdown bis{" "}
        <span className="font-bold text-foreground">{eventName}</span>
      </p>
      <div className="grid grid-cols-4 gap-3">
        {units.map(({ value, label }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-surface p-3 text-center"
          >
            <div className="font-heading text-3xl font-bold text-accent-text">
              {String(value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
