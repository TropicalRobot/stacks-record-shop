import { readFile } from "node:fs/promises";
import path from "node:path";

export type PostItem = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
};

async function readPostsFile(): Promise<PostItem[]> {
  const filePath = path.join(process.cwd(), "src", "data", "posts.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as PostItem[];
}

export async function getAllPosts(): Promise<PostItem[]> {
  const posts = await readPostsFile();
  return [...posts].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export async function getLatestPosts(limit = 3): Promise<PostItem[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}
