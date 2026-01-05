import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { getAllPosts } from "@/lib/data/posts";
import { getAllRecords, getInventoryByRecordId } from "@/lib/data/records";
import { searchPosts, searchRecords } from "@/lib/search";
import { formatGBP } from "@/lib/demo";

/**
 * Stage 5: Dynamic rendering by necessity
 * - Depends on searchParams (unbounded URL space)
 * - We intentionally avoid caching here
 */
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  // We reuse our existing data access:
  const [posts, records] = await Promise.all([getAllPosts(), getAllRecords()]);

  const postResults = query ? searchPosts(posts, query) : [];
  const recordResults = query ? searchRecords(records, query) : [];

  const hasResults = postResults.length > 0 || recordResults.length > 0;

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        <p className="max-w-2xl text-muted-foreground">
          This page is intentionally dynamic. It depends on query parameters and
          has an effectively infinite number of possible URLs.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Query</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Simple "shareable URL" search box */}
          <form action="/search" method="GET" className="flex gap-2">
            <Input
              name="q"
              placeholder='Try: "warp", "jazz", "dilla", "grading"'
              defaultValue={query}
            />
          </form>

          <div className="text-sm text-muted-foreground">
            Showing results for:{" "}
            <span className="font-mono">{query || "(empty)"}</span>
          </div>
        </CardContent>
      </Card>

      {query ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Records{" "}
                <Badge variant="secondary">{recordResults.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recordResults.length ? (
                recordResults.map((r) => {
                  const inv = getInventoryByRecordId(r.id);
                  const stockLabel = inv?.inStock
                    ? `In stock (${inv.quantity})`
                    : "Out of stock";

                  return (
                    <div key={r.id} className="space-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">
                            {r.artist} — {r.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {r.year} · {r.label}
                          </div>
                        </div>
                        <div className="shrink-0 font-mono text-sm">
                          {formatGBP(r.price_gbp)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {r.genres.slice(0, 2).map((g) => (
                          <Badge key={g} variant="secondary">
                            {g}
                          </Badge>
                        ))}
                        <Badge variant="outline">{stockLabel}</Badge>
                        <Badge variant="outline">
                          <Link
                            className="hover:underline"
                            href={`/records/${r.id}`}
                          >
                            View record
                          </Link>
                        </Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">
                  No record matches.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Journal <Badge variant="secondary">{postResults.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {postResults.length ? (
                postResults.map((p) => (
                  <div key={p.slug} className="space-y-1">
                    <div className="font-medium">
                      <Link
                        className="hover:underline"
                        href={`/journal/${p.slug}`}
                      >
                        {p.title}
                      </Link>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {p.excerpt}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No journal matches.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Type a query to search records and journal posts.
          </CardContent>
        </Card>
      )}

      {query && !hasResults ? (
        <div className="text-sm text-muted-foreground">
          Tip: try searching by label (Warp), genre (Jazz), artist (Nina), or a
          journal topic (grading).
        </div>
      ) : null}

      <DebugPanel
        pageName="search"
        notes={[
          'Stage 5: dynamic = "force-dynamic".',
          "This page is rendered per request (no ISR / no static snapshot).",
          "In production, renderedAt should change on every refresh.",
        ]}
      />
    </div>
  );
}
