import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBuildStamp, isoNow } from "@/lib/demo";

type DebugPanelProps = {
  pageName: string;
  notes?: string[];
  // Stage 0: we intentionally do NOT use cookies()/headers() here
  // because we don’t want to accidentally force pages to be dynamic.
};

export function DebugPanel({ pageName, notes }: DebugPanelProps) {
  // For static pages, this will be evaluated at build-time.
  // In dev mode it may appear to change more often — we’ll cover that later.
  const renderedAt = isoNow();
  const buildStamp = getBuildStamp();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Debug Panel</CardTitle>
        <Badge variant="outline">{pageName}</Badge>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <div className="text-muted-foreground">renderedAt</div>
            <div className="font-mono">{renderedAt}</div>
          </div>
          <div>
            <div className="text-muted-foreground">buildStamp</div>
            <div className="font-mono">{buildStamp}</div>
          </div>
        </div>

        {notes?.length ? (
          <div className="space-y-1">
            <div className="text-muted-foreground">notes</div>
            <ul className="list-disc space-y-1 pl-5">
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
