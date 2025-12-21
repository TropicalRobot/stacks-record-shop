import records from "@/data/records.json";
import inventory from "@/data/inventory.json";

export type RecordItem = {
  id: string;
  artist: string;
  title: string;
  year: number;
  label: string;
  genres: string[];
  formats: string[];
  price_gbp: number;
  updatedAt: string;
};

export type InventoryItem = {
  recordId: string;
  inStock: boolean;
  quantity: number;
  lastCheckedAt: string;
};

export function getAllRecords(): RecordItem[] {
  // Keep deterministic ordering for screenshots/docs
  return [...(records as RecordItem[])].sort((a, b) =>
    a.artist.localeCompare(b.artist),
  );
}

export function getFeaturedRecords(limit = 4): RecordItem[] {
  return getAllRecords().slice(0, limit);
}

export function getInventoryByRecordId(recordId: string): InventoryItem | null {
  return (
    (inventory as InventoryItem[]).find((i) => i.recordId === recordId) ?? null
  );
}
