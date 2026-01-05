import type { PostItem } from "@/lib/data/posts";
import type { RecordItem } from "@/lib/data/records";

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function matchesAllTokens(haystack: string, tokens: string[]): boolean {
  const h = haystack.toLowerCase();
  return tokens.every((t) => h.includes(t));
}

export function searchPosts(posts: PostItem[], q: string): PostItem[] {
  const tokens = tokenize(q);
  if (!tokens.length) return [];
  return posts.filter((p) =>
    matchesAllTokens(`${p.title} ${p.excerpt} ${p.tags.join(" ")}`, tokens),
  );
}

export function searchRecords(records: RecordItem[], q: string): RecordItem[] {
  const tokens = tokenize(q);
  if (!tokens.length) return [];
  return records.filter((r) =>
    matchesAllTokens(
      `${r.artist} ${r.title} ${r.label} ${r.genres.join(" ")} ${r.formats.join(" ")}`,
      tokens,
    ),
  );
}
