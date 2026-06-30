import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, Sprout, Building2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Protected Cultivation Advisory" },
      {
        name: "description",
        content:
          "Data-driven advice for choosing the right protected farming structure, estimating bill of materials, and unlocking government subsidies.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="border-b bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            For farmers in UP, MP, Maharashtra, Uttarakhand & HP
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Protected Cultivation Advisory
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Drop a pin on your field. Get structure recommendations, bill of materials,
            and subsidy estimates — instantly.
          </p>
          <div className="mt-8">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
            >
              <MapPin className="h-5 w-5" />
              Start Advisory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6 text-center">
            <Stat n="188" label="Districts covered" />
            <Stat n="11" label="Crops" />
            <Stat n="8" label="Structure types" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<MapPin className="h-5 w-5" />}
            title="Pin Your Field"
            desc="Click on the map. We auto-detect your district, terrain, elevation, and nearby infrastructure."
          />
          <FeatureCard
            icon={<Sprout className="h-5 w-5" />}
            title="Instant Advisory"
            desc="Crops ranked by climate fit, structures by suitability score, costs adjusted for your site."
          />
          <FeatureCard
            icon={<TrendingUp className="h-5 w-5" />}
            title="Full Financials"
            desc="BOM with IS-standard materials, government subsidy estimates, and cost-per-sqm breakdown."
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-3xl font-bold text-primary">{n}</div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
