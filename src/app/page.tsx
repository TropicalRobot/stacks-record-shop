import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { getFeaturedRecords, getInventoryByRecordId } from "@/lib/data/records";
import { getLatestPosts } from "@/lib/data/posts";
import { formatGBP } from "@/lib/demo";

export default function HomePage() {
  const featured = getFeaturedRecords(4);
  const posts = getLatestPosts(3);

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Stacks Record Shop
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A small vinyl shop demo built to explain Next.js rendering, caching,
          and streaming with real-ish page scenarios.
        </p>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/">Browse featured</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">Read the journal</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Featured Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {featured.map((r) => {
              const inv = getInventoryByRecordId(r.id);
              const stockLabel = inv?.inStock
                ? `In stock (${inv.quantity})`
                : "Out of stock";

              return (
                <div
                  key={r.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {r.artist} — {r.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {r.year} · {r.label}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {r.genres.slice(0, 2).map((g) => (
                        <Badge key={g} variant="secondary">
                          {g}
                        </Badge>
                      ))}
                      <Badge variant="outline">{stockLabel}</Badge>
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-sm">
                    {formatGBP(r.price_gbp)}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lates Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {posts.map((p) => (
              <div key={p.slug} className="space-y-1">
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-muted-foreground">{p.excerpt}</div>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-sm text-muted-foreground">
              (We’ll turn these into real routes in later stages.)
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Proof box</h2>
        <DebugPanel
          pageName="home"
          notes={[
            "Stage 0: data + UI shell + Debug Panel (no caching techniques yet).",
            "In production builds, renderedAt should reflect build-time for static pages.",
          ]}
        />
      </section>
    </div>
  );
}
