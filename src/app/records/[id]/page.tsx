import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { getAllRecords, getRecordById } from "@/lib/data/records";
import { formatGBP } from "@/lib/demo";
import { LiveStock } from "@/components/records/LiveStock";

/**
 * Stage 7: Mixed rendering
 * - Core record data: cached + tagged (ISR-style)
 * - Stock widget: dynamic no-store fetch, streamed with Suspense
 */
export const revalidate = 60;

export async function generateStaticParams() {
  const records = await getAllRecords();
  return records.map((r) => ({ id: r.id }));
}

const getRecordCached = unstable_cache(
  async (id: string) => {
    const record = await getRecordById(id);
    return { record, shellRenderedAt: new Date().toISOString() };
  },
  ["record-by-id"],
  { tags: ["records"], revalidate: 60 },
);

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cached = await getRecordCached(id);
  const record = cached.record;

  if (!record) notFound();

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {record.artist} — {record.title}
        </h1>
        <p className="text-muted-foreground">
          {record.year} · {record.label}
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Record details (cached)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-1">
            {record.genres.map((g) => (
              <Badge key={g} variant="secondary">
                {g}
              </Badge>
            ))}
            {record.formats.map((f) => (
              <Badge key={f} variant="outline">
                {f}
              </Badge>
            ))}
          </div>

          <div className="font-mono">{formatGBP(record.price_gbp)}</div>

          <div className="rounded-md border p-3">
            <div className="mb-2 text-sm font-medium">
              Live stock (no-store, streamed)
            </div>
            <Suspense
              fallback={
                <div className="text-muted-foreground">Checking stock…</div>
              }
            >
              <LiveStock recordId={record.id} />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      <DebugPanel
        pageName="record-detail"
        notes={[
          "Stage 7: Core record data is cached + tagged ('records').",
          "Live stock is fetched with cache: 'no-store' and streamed with Suspense.",
          "In production, renderedAt may stay stable while the stock 'checked' timestamp changes on refresh.",
        ]}
        facts={{
          recordUpdatedAt: record.updatedAt,
          shellRenderedAt: cached.shellRenderedAt,
        }}
      />
    </div>
  );
}
