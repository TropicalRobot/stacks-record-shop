export function getBuildStamp(): string {
  // Useful for proving when a page was rebuilt (later stages).
  return process.env.NEXT_PUBLIC_DEMO_BUILD_ID ?? "local";
}

export function formatGBP(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);
}

export function isoNow(): string {
  return new Date().toISOString();
}
