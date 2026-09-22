const TIERS = [
  { name: "Platin", color: "text-[#e5e4e2]", border: "border-[#e5e4e2]/30", bg: "bg-[#e5e4e2]/5" },
  { name: "Gold", color: "text-[#fbbf24]", border: "border-[#fbbf24]/30", bg: "bg-[#fbbf24]/5" },
  { name: "Silber", color: "text-[#94a3b8]", border: "border-[#94a3b8]/30", bg: "bg-[#94a3b8]/5" },
  { name: "Partner", color: "text-accent-text", border: "border-accent/30", bg: "bg-accent/5" },
] as const;

const BENEFITS: { label: string; platin: string; gold: string; silber: string; partner: string }[] = [
  { label: "Logo am Fahrzeug", platin: "Groß (Hauptfläche)", gold: "Mittel", silber: "Klein", partner: "—" },
  { label: "Logo auf Website", platin: "✓ Alle Seiten", gold: "✓ Sponsorenseite", silber: "✓ Sponsorenseite", partner: "✓ Sponsorenseite" },
  { label: "Social-Media-Erwähnung", platin: "Monatlich + Events", gold: "Bei Events", silber: "Saisonstart/-ende", partner: "Saisonstart" },
  { label: "Teamkleidung", platin: "✓ Logo", gold: "✓ Logo", silber: "—", partner: "—" },
  { label: "Besuche / Werksführungen", platin: "Unbegrenzt", gold: "2× pro Saison", silber: "1× pro Saison", partner: "—" },
  { label: "Pressemitteilungen", platin: "✓ Mit Namensnennung", gold: "✓ Mit Namensnennung", silber: "—", partner: "—" },
  { label: "Wettbewerbs-VIP-Pässe", platin: "2 Pässe", gold: "1 Pass", silber: "—", partner: "—" },
  { label: "Technisches Briefing", platin: "✓ Detailliert", gold: "✓", silber: "—", partner: "—" },
];

export default function SponsorTierTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-44 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted" />
            {TIERS.map((tier) => (
              <th
                key={tier.name}
                className={`border-t ${tier.border} ${tier.bg} px-4 py-3 text-center text-sm font-bold ${tier.color}`}
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BENEFITS.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-surface/40" : ""}>
              <td className="border-t border-border px-4 py-3 font-medium text-foreground">{row.label}</td>
              {(["platin", "gold", "silber", "partner"] as const).map((tier, ti) => (
                <td
                  key={tier}
                  className={`border-t border-border px-4 py-3 text-center ${row[tier] === "—" ? "text-muted/40" : "text-muted"} ${TIERS[ti].bg}`}
                >
                  {row[tier]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
