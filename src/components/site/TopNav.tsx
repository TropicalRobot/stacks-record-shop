import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function TopNav() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">Stacks</span>
          <Badge variant="secondary">demo</Badge>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link className="hover:text-foreground" href="/">
            Home
          </Link>
          {/* We’ll add these routes in later stages */}
          <Link className="hover:text-foreground" href="/cache-lab">
            Cache Lab
          </Link>
          <Link className="hover:text-foreground" href="/records">
            Records
          </Link>{" "}
          <span className="opacity-50">
            <Link className="hover:text-foreground" href="/journal">
              Journal
            </Link>
          </span>
          <Link className="hover:text-foreground" href="/search">
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}
