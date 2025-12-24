"use server";

import { updateTag } from "next/cache";
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

export async function touchJournalPostWithUpdateTag(slug: string) {
  const filePath = postsFilePath();
  const raw = await readFile(filePath, "utf-8");
  const posts = JSON.parse(raw) as PostItem[];

  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) throw new Error(`Unknown slug: ${slug}`);

  const now = new Date().toISOString();
  posts[idx] = {
    ...posts[idx],
    updatedAt: now,
    title: posts[idx].title.includes("• Updated")
      ? posts[idx].title
      : `${posts[idx].title} • Updated`,
  };

  await writeFile(filePath, JSON.stringify(posts, null, 2) + "\n", "utf-8");

  // Read-your-own-writes behaviour (Server Actions only)
  updateTag("journal");

  return { ok: true, slug, updatedAt: now };
}
