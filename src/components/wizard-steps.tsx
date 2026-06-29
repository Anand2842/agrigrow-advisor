import { Link, useLocation } from "@tanstack/react-router";
import { Check } from "lucide-react";

const STEPS = [
  { to: "/district", label: "District" },
  { to: "/crop", label: "Crop" },
  { to: "/recommendations", label: "Structure" },
  { to: "/bom", label: "BOM" },
  { to: "/subsidy", label: "Subsidy" },
  { to: "/report", label: "Report" },
] as const;

export function WizardSteps() {
  const { pathname } = useLocation();
  const currentIdx = STEPS.findIndex((s) => pathname.startsWith(s.to));

  return (
    <div className="no-print mx-auto max-w-7xl px-4 pt-4">
      <ol className="flex w-full items-center gap-1 overflow-x-auto text-xs">
        {STEPS.map((s, i) => {
          const done = currentIdx > i;
          const active = currentIdx === i;
          return (
            <li key={s.to} className="flex flex-1 items-center gap-2 min-w-fit">
              <Link
                to={s.to}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : done
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/30 text-[10px] font-semibold">
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="font-medium">{s.label}</span>
              </Link>
              {i < STEPS.length - 1 && (
                <span className="h-px flex-1 bg-border" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
