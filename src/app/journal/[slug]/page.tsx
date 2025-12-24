export const dynamic = "force-static";
import { unstable_cache } from "next/cache";

import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { getAllPosts, getPostBySlug } from "@/lib/data/posts";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

const getPostCached = unstable_cache(
  async (slug: string) => getPostBySlug(slug),
  ["journal-post-by-slug"],
  { tags: ["journal"] },
);

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostCached(slug);
  if (!post) notFound();

  return (
    <div className="space-y-8">
      <article className="space-y-4">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Post content</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              This is intentionally minimal. In a real app, this would render
              markdown or rich content.
            </p>
          </CardContent>
        </Card>
      </article>

      <DebugPanel
        pageName="journal-post"
        notes={[
          "Stage 3: Static generation via generateStaticParams().",
          "On this Next.js version, params is async so we await it.",
          "No revalidate timer — this page won’t update automatically.",
        ]}
      />
    </div>
  );
}
