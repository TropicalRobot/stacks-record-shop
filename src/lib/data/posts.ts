import posts from "@/data/posts.json";

export type PostItem = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
};

export function getAllPosts(): PostItem[] {
  return [...(posts as PostItem[])].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export function getLatestPosts(limit = 3): PostItem[] {
  return getAllPosts().slice(0, limit);
}
