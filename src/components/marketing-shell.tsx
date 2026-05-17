import { Link } from "@tanstack/react-router";
import { Waves, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Waves className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">FlowSim</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground">Product</Link>
          <Link to="/pricing" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">Pricing</Link>
          <Link to="/docs" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">Docs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
          <Button asChild size="sm"><Link to="/signup">Start free</Link></Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  const cols = [
    { title: "Product", links: [["Features", "/"], ["Pricing", "/pricing"], ["Dashboard", "/app/overview"]] },
    { title: "Docs", links: [["Quickstart", "/docs"], ["API reference", "/docs"], ["Scenarios", "/docs"]] },
    { title: "Security", links: [["Sandbox safety", "/docs"], ["No real funds", "/docs"], ["SOC 2 (soon)", "/docs"]] },
    { title: "Company", links: [["About", "/"], ["Contact", "/"], ["Careers", "/"]] },
  ] as const;
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground"><Waves className="h-4 w-4" /></div>
            <span className="text-sm font-semibold">FlowSim</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Test fintech integrations, simulate failures, and investigate incidents — before they cost money.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {c.links.map(([label, to]) => (
                <li key={label}><Link to={to} className="hover:text-foreground">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-xs text-muted-foreground">
          <p>© 2026 FlowSim Labs. All sandbox, no real funds.</p>
          <div className="flex gap-3">
            <a href="#" aria-label="GitHub"><Github className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
