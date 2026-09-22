import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import FaqAccordion from "../FaqAccordion";

const items = [
  { question: "Frage 1", answer: "Antwort 1" },
  { question: "Frage 2", answer: "Antwort 2" },
];

describe("FaqAccordion", () => {
  it("renders all questions; answers are not visible initially", () => {
    render(<FaqAccordion items={items} />);
    expect(screen.getByText("Frage 1")).toBeInTheDocument();
    expect(screen.getByText("Frage 2")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toHaveAttribute("aria-expanded", "false"));
  });

  it("shows answer when question is clicked", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    await user.click(screen.getByRole("button", { name: /Frage 1/i }));
    expect(screen.getByRole("button", { name: /Frage 1/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Antwort 1")).toBeInTheDocument();
  });

  it("hides answer when open question is clicked again", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    const btn = screen.getByRole("button", { name: /Frage 1/i });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });
});
