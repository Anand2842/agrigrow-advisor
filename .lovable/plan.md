
# Protected Cultivation Advisory — Full MVP

Build a 9-page React + TanStack Start app wired to the already-connected Supabase project (15 reference tables). No authentication in this build — Login/Dashboard are deferred. PDF export uses browser print (print-optimized CSS + `window.print()`).

## Tech & conventions

- TanStack Start file-based routes under `src/routes/` (flat dot-naming).
- Data fetching: TanStack Query (`useSuspenseQuery` + loader `ensureQueryData`) against the browser Supabase client (`@/integrations/supabase/client`) since all reference tables are public-read.
- State for the advisory wizard: a lightweight Zustand store persisted to `localStorage` (`{ state, districtId, cropIds[], structureId, areaSqm, tier, farmerCategory, landHolding, isFirstTime }`).
- UI: existing shadcn components + Tailwind tokens. Colors added as semantic tokens in `src/styles.css` (primary blue, secondary green, accent amber) — no hardcoded hex in components.
- Fonts: Inter via `@fontsource/inter`, JetBrains Mono via `@fontsource/jetbrains-mono`, imported in `src/start.ts`.
- Toasts via `sonner`. Charts via `recharts` (already common). Icons via `lucide-react`.

## Routes

```text
src/routes/
  __root.tsx              ← add Navbar/Footer, Toaster, global head
  index.tsx               ← Home (hero, 3 feature cards, stats, CTA)
  district.tsx            ← State+District selectors, climate summary
  crop.tsx                ← Multi-select crop grid (11 crops)
  recommendations.tsx     ← Ranked structure cards + filters
  bom.tsx                 ← BOM calculator + warnings + print
  subsidy.tsx             ← Subsidy eligibility calculator
  report.tsx              ← Full advisory report, print-friendly
```

Login/Dashboard are skipped per scope choice. A wizard progress bar in the navbar links District → Crop → Recommendations → BOM → Subsidy → Report.

## Components

- Layout: `Navbar`, `Footer`, `WizardSteps`
- Selectors: `StateSelector`, `DistrictSelector` (searchable, filtered by state)
- Cards: `CropCard`, `StructureCard`, `SubsidyCard`, `WeatherWidget`
- Data display: `MaterialTable`, `PriceChart` (monthly prices), `WarningBadge`, `CostBreakdown`
- Form: `NumericInput`, `SelectDropdown`, `SearchInput`, `RangeSlider`
- Utility: `LoadingSpinner`, error/notFound components per route

## Data layer (`src/lib/queries.ts`)

Typed query option factories so loaders + components share keys:

- `districtsByState(state)`, `districtClimate(id)`
- `cropsAll()`, `cropById(id)`, `monthlyPrices(cropId, state)`
- `structuresForCrops(cropIds[])` → joins `crop_structure_match` + `structure_data`, aggregates suitability across selected crops
- `materialsForStructure(structureId)` filtered by `item_type='essential'` and `needed_for_structures` LIKE
- `subsidiesByState(state)`

## BOM calculation (client-side, mirrors existing `calculate_bom` RPC)

Pure function in `src/lib/bom.ts`:
1. Pull materials for the structure.
2. Quantity heuristic from `quantity_formula` keywords (area/perimeter/columns) × area × `wastage_factor`.
3. Unit price from `tier_{a|b|c}_price_{up|mp|mh}` based on selected tier + state.
4. Adjustments: coastal corrosion factor >1.5 → +30% on pipe categories + HDG warning; fog days (Jan/Dec) >10 → +15% on film + anti-drip warning; Marathwada → Fan&Pad water warning.
5. Returns line items, totals, category breakdown, warnings.

(Optional later: swap to the existing `calculate_bom` Postgres function via `supabase.rpc`.)

## Subsidy calculation (`src/lib/subsidy.ts`)

Mirrors existing `calculate_subsidy` RPC: filter schemes by state, check land holding / area / first-time / structure eligibility, pick percent by farmer category, apply ceiling. Returns eligible schemes with amounts and conditions.

## Print-to-PDF

Each printable page (`/bom`, `/report`) has a `.print-area` wrapper and a `@media print` block in `src/styles.css` that hides nav/footer/buttons and forces single-column layout. "Download PDF" button calls `window.print()`.

## Design tokens (added to `src/styles.css`)

```text
--primary:   oklch(~ #2563EB)
--secondary: oklch(~ #16A34A)
--accent:    oklch(~ #F59E0B)
--background: oklch(~ #F8FAFC)
--foreground: oklch(~ #1E293B)
--muted-foreground: oklch(~ #64748B)
```

Plus matching `.dark` variants. Existing chart-* tokens reused.

## Out of scope (this build)

- Authentication, Login page, Dashboard, saved advisories, price alerts (need auth + writable tables).
- WhatsApp share, offline/PWA, i18n (Hindi).
- E2E test suite.
- True PDF generation (using print only).

These can be added in follow-up turns.

## Deliverable checklist

- [ ] 7 advisory routes + updated `__root.tsx`
- [ ] Zustand wizard store with persistence
- [ ] Query factories + Supabase reads working against the connected project
- [ ] BOM + Subsidy calculators with warnings
- [ ] Print-friendly Report page
- [ ] Design tokens + Inter/JetBrains Mono fonts
- [ ] Build passes (`bun run build:dev`)
