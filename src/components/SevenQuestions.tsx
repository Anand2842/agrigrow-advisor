import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface ManualAnswers {
  soilType: string | null;
  waterSource: string | null;
  waterQuality: string | null;
  windbreak: string | null;
  nearbyStructures: string | null;
  frostPocket: string | null;
  floodRisk: string | null;
}

interface SevenQuestionsProps {
  onComplete: (answers: ManualAnswers) => void;
  initialAnswers?: {
    soilType?: string | null;
    waterSource?: string | null;
    waterQuality?: string | null;
    windbreak?: string | null;
    nearbyStructures?: string | null;
    frostPocket?: string | null;
    floodRisk?: string | null;
  };
}

const QUESTIONS: Array<{
  key: keyof ManualAnswers;
  label: string;
  description: string;
  options: string[];
}> = [
  {
    key: "soilType",
    label: "Soil Type",
    description: "What type of soil is on your field?",
    options: ["Black Cotton", "Red Laterite", "Alluvial", "Sandy Loam", "Rocky", "Clay"],
  },
  {
    key: "waterSource",
    label: "Water Source",
    description: "What is your primary water source?",
    options: ["Bore well", "Canal", "River", "Pond", "Municipal supply"],
  },
  {
    key: "waterQuality",
    label: "Water Quality",
    description: "How is your water quality? (EC = Electrical Conductivity)",
    options: ["Good (EC < 1 dS/m)", "Moderate (EC 1-2 dS/m)", "Poor (EC > 2 dS/m)"],
  },
  {
    key: "windbreak",
    label: "Existing Windbreak",
    description: "Are there trees or structures blocking wind around your field?",
    options: ["None", "Trees on one side", "Trees on multiple sides", "Building/structure"],
  },
  {
    key: "nearbyStructures",
    label: "Nearby Structures",
    description: "What is close to your field?",
    options: ["Nothing significant", "Residential building", "Factory/warehouse", "Hill/mountain"],
  },
  {
    key: "frostPocket",
    label: "Frost Pocket",
    description: "Does your field experience frost in winter? (Low-lying areas collect cold air)",
    options: ["Yes, frequently", "Sometimes", "No", "Not sure"],
  },
  {
    key: "floodRisk",
    label: "Flood Risk",
    description: "Is your field at risk of flooding during monsoon?",
    options: ["High risk", "Medium risk", "Low risk", "No risk"],
  },
];

export function SevenQuestions({ onComplete, initialAnswers = {} }: SevenQuestionsProps) {
  const [answers, setAnswers] = useState<Partial<ManualAnswers>>(initialAnswers);
  const answeredCount = Object.keys(answers).filter((k) => answers[k as keyof ManualAnswers]).length;

  const handleSelect = (key: keyof ManualAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onComplete({
      soilType: answers.soilType || "Alluvial",
      waterSource: answers.waterSource || "Bore well",
      waterQuality: answers.waterQuality || "Good (EC < 1 dS/m)",
      windbreak: answers.windbreak || "None",
      nearbyStructures: answers.nearbyStructures || "Nothing significant",
      frostPocket: answers.frostPocket || "Not sure",
      floodRisk: answers.floodRisk || "Low risk",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Field Details</h3>
        <span className="text-sm text-slate-500">
          {answeredCount}/{QUESTIONS.length} answered
        </span>
      </div>
      <p className="text-sm text-slate-600">
        These details help us give you better recommendations. Fill in what you know.
      </p>

      <div className="space-y-3">
        {QUESTIONS.map((q) => (
          <Card key={q.key}>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{q.label}</label>
                <p className="text-xs text-slate-500">{q.description}</p>
                <Select
                  value={answers[q.key] || ""}
                  onValueChange={(v) => handleSelect(q.key, v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {q.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg" className="px-8">
          Save & Continue
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
