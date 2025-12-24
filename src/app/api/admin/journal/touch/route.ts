import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type PostItem = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
};

function postsFilePath() {
  return path.join(process.cwd(), "src", "data", "posts.json");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { slug?: string };
  const slug = body.slug;

  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "Missing slug" },
      { status: 400 },
    );
  }

  const filePath = postsFilePath();
  const raw = await readFile(filePath, "utf-8");
  const posts = JSON.parse(raw) as PostItem[];

  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) {
    return NextResponse.json(
      { ok: false, error: `Unknown slug: ${slug}` },
      { status: 404 },
    );
  }

  // "Touch" the post to simulate an edit/publish event
  const now = new Date().toISOString();
  posts[idx] = {
    ...posts[idx],
    updatedAt: now,
    title: posts[idx].title.includes("• Updated")
      ? posts[idx].title
      : `${posts[idx].title} • Updated`,
  };

  await writeFile(filePath, JSON.stringify(posts, null, 2) + "\n", "utf-8");

  // The key line: instantly invalidate any caches tagged "journal"
  revalidateTag("journal", "max");

  return NextResponse.json({
    ok: true,
    touched: slug,
    updatedAt: now,
    revalidated: ["journal"],
  });
}
