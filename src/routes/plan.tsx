import { createFileRoute } from "@tanstack/react-router";
import { SiteMapPanel } from "@/components/plan/SiteMapPanel";
import { InputsPanel } from "@/components/plan/InputsPanel";
import { AdvisoryPanel } from "@/components/plan/AdvisoryPanel";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan — PCA" },
      { name: "description", content: "Get a full protected cultivation advisory for your field." },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  return (
    <div className="h-[calc(100dvh-3.5rem)] flex flex-col lg:flex-row overflow-hidden">
      {/* Left: Map */}
      <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 border-b lg:border-b-0 lg:border-r overflow-y-auto">
        <SiteMapPanel />
      </div>

      {/* Center: Advisory (live results) */}
      <div className="flex-1 overflow-y-auto p-4">
        <AdvisoryPanel />
      </div>

      {/* Right: Inputs rail (collapsible on mobile) */}
      <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 border-t lg:border-t-0 lg:border-l overflow-y-auto bg-muted/20">
        <div className="p-3 border-b lg:hidden">
          <h2 className="text-sm font-semibold">Settings</h2>
        </div>
        <InputsPanel />
      </div>
    </div>
  );
}
