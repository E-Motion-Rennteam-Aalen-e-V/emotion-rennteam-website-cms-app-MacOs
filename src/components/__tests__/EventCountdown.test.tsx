import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EventCountdown from "@/components/motion/EventCountdown";

describe("EventCountdown", () => {
  it("renders without crash with a future date", async () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    render(<EventCountdown eventName="Test Event" eventDate={futureDate} />);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(screen.getByText("Tage")).toBeInTheDocument();
    expect(screen.getByText("Stunden")).toBeInTheDocument();
    expect(screen.getByText("Minuten")).toBeInTheDocument();
    expect(screen.getByText("Sekunden")).toBeInTheDocument();
  });

  it("shows 'Wettbewerb läuft!' with a past date", async () => {
    const pastDate = new Date(Date.now() - 1000);
    render(<EventCountdown eventName="Test Event" eventDate={pastDate} />);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(screen.getByText(/Wettbewerb läuft!/)).toBeInTheDocument();
  });
});
