import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

export function Navbar() {
  return (
    <header className="no-print sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sprout className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Protected Cultivation Advisory</span>
          <span className="sm:hidden">PCA</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/plan"
            className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-1.5 text-foreground font-medium bg-muted" }}
          >
            Advisory
          </Link>
          <Link
            to="/report"
            className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-1.5 text-foreground font-medium bg-muted" }}
          >
            Report
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print border-t bg-muted/30 mt-12">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Protected Cultivation Advisory · UP · MP · MH · UK · HP</p>
        <p>Data sourced from government schemes & district climate records.</p>
      </div>
    </footer>
  );
}
