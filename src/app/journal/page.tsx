import { unstable_cache } from "next/cache";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { getAllPosts } from "@/lib/data/posts";
import Link from "next/link";

/**
 * Stage 2: ISR
 * This page is statically rendered, but will revalidate after the interval.
 */
export const revalidate = 10; // seconds (short for demo purposes)

const getJournalPostsCached = unstable_cache(
  async () => getAllPosts(),
  ["journal-posts"],
  { tags: ["journal"] },
);

export default async function JournalIndexPage() {
  const posts = await getJournalPostsCached();

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
        <p className="text-muted-foreground max-w-2xl">
          Editorial notes, guides, and shop updates. This page uses Incremental
          Static Regeneration (ISR).
        </p>
      </section>

      <section className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.slug}>
            <CardHeader>
              <CardTitle className="text-base">
                <Link
                  href={`/journal/${post.slug}`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </CardTitle>{" "}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <DebugPanel
        pageName="journal-index"
        notes={[
          "Stage 2: Incremental Static Regeneration (ISR).",
          "This page is static, but revalidates every 10 seconds.",
          "Between revalidations, renderedAt should remain stable.",
        ]}
      />
    </div>
  );
}
