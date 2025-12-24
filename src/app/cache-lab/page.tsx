import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { getAllPosts } from "@/lib/data/posts";
import { touchJournalPostWithUpdateTag } from "@/lib/actions/journal";

export default async function CacheLabPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Cache Lab</h1>
        <p className="max-w-2xl text-muted-foreground">
          Buttons that mutate demo data and trigger revalidation. This is here
          purely to make caching behaviour observable.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">On-demand revalidation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Pick a post slug and “touch” it. This updates posts.json and calls{" "}
            <span className="font-mono">revalidateTag("journal")</span>.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="font-medium">
                A) Route Handler + revalidateTag (SWR)
              </div>
              <p className="text-sm text-muted-foreground">
                This calls{" "}
                <span className="font-mono">/api/admin/journal/touch</span>,
                which uses{" "}
                <span className="font-mono">
                  revalidateTag("journal", "max")
                </span>
                . Expect stale-while-revalidate: sometimes you’ll need two
                refreshes on the post detail page.
              </p>

              <div className="flex flex-wrap gap-2">
                {posts.map((p) => (
                  <form
                    key={`rt-${p.slug}`}
                    action={async () => {
                      "use server";
                      await fetch(
                        "http://localhost:3000/api/admin/journal/touch",
                        {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ slug: p.slug }),
                        },
                      );
                    }}
                  >
                    <Button type="submit" variant="secondary">
                      Touch (revalidateTag): {p.slug}
                    </Button>
                  </form>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium">
                B) Server Action + updateTag (read-your-writes)
              </div>
              <p className="text-sm text-muted-foreground">
                This performs the same mutation but calls{" "}
                <span className="font-mono">updateTag("journal")</span>. This
                should feel immediate on the next refresh/navigation.
              </p>

              <div className="flex flex-wrap gap-2">
                {posts.map((p) => (
                  <form
                    key={`sa-${p.slug}`}
                    action={async () => {
                      "use server";
                      await touchJournalPostWithUpdateTag(p.slug);
                    }}
                  >
                    <Button type="submit">Touch (updateTag): {p.slug}</Button>
                  </form>
                ))}
              </div>
            </div>
          </div>

          <p className="text-muted-foreground">
            After touching, refresh <span className="font-mono">/journal</span>{" "}
            and a post page. You should see updates immediately (no need to wait
            10s).
          </p>
        </CardContent>
      </Card>

      <DebugPanel
        pageName="cache-lab"
        notes={[
          "Stage 4: On-demand revalidation via revalidateTag('journal').",
          "This page uses a Server Action to call the admin route.",
          "Refresh /journal and /journal/[slug] after touching to confirm instant updates.",
        ]}
      />
    </div>
  );
}
