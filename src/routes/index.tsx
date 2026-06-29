import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Leaf, Building2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Protected Cultivation Advisory" },
      {
        name: "description",
        content:
          "Pick your district & crops to get structure recommendations, BOM cost, and subsidy estimates for protected farming in UP, MP, and Maharashtra.",
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
            For farmers in UP, MP & Maharashtra
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Protected Cultivation Advisory
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Data-driven advice for choosing the right protected farming structure,
            estimating bill of materials, and unlocking government subsidies.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/district"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Start Advisory <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-accent"
            >
              Browse Structures
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6 text-center">
            <Stat n="163" label="Districts covered" />
            <Stat n="11" label="Crops" />
            <Stat n="8" label="Structure types" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<MapPin className="h-5 w-5" />}
            title="District Selection"
            desc="Choose your district to see climate, rainfall, fog days, and agro-climatic zone."
          />
          <FeatureCard
            icon={<Leaf className="h-5 w-5" />}
            title="Crop Planning"
            desc="Pick one or more crops. We use temperature, season, and market price data."
          />
          <FeatureCard
            icon={<Building2 className="h-5 w-5" />}
            title="Structure Recommendation"
            desc="Get ranked structure suggestions with cost ranges and climate match notes."
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
