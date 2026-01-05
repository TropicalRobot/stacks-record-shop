import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { getAllRecords, getInventoryByRecordId } from "@/lib/data/records";
import { formatGBP } from "@/lib/demo";

/**
 * Stage 6: Cached catalog index (ISR + tag invalidation ready)
 *
 * - This page is a great ISR candidate: mostly stable, occasional updates.
 * - We'll tag it so it can be instantly invalidated later.
 */
export const revalidate = 30; // seconds (short for demo; in real life maybe minutes/hours)

const getRecordsCached = unstable_cache(
  async () => getAllRecords(),
  ["records-index"],
  { tags: ["records"] },
);

export default async function RecordsIndexPage() {
  const records = await getRecordsCached();

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Records</h1>
        <p className="max-w-2xl text-muted-foreground">
          A cached catalog index page. This is ISR (revalidate every 30s) and is
          also tagged for on-demand invalidation later.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {records.map((r) => {
          return (
            <Card key={r.id}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">
                  <Link className="hover:underline" href={`/records/${r.id}`}>
                    {r.artist} — {r.title}
                  </Link>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {r.year} · {r.label}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {r.genres.slice(0, 3).map((g) => (
                    <Badge key={g} variant="secondary">
                      {g}
                    </Badge>
                  ))}
                  {r.formats.slice(0, 2).map((f) => (
                    <Badge key={f} variant="outline">
                      {f}
                    </Badge>
                  ))}
                  <Badge variant="outline">View details for stock</Badge>{" "}
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm">
                    {formatGBP(r.price_gbp)}
                  </div>
                  <Link
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    href={`/records/${r.id}`}
                  >
                    View record →
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <DebugPanel
        pageName="records-index"
        notes={[
          "Stage 6: Catalog index using ISR (revalidate=30s).",
          'Also tagged via unstable_cache(..., { tags: ["records"] }) for later on-demand invalidation.',
          "In production, renderedAt should stay stable within the revalidate window.",
        ]}
      />
    </div>
  );
}
