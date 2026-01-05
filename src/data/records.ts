import { readFile } from "node:fs/promises";
import path from "node:path";

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

function recordsFilePath() {
  return path.join(process.cwd(), "src", "data", "records.json");
}

function inventoryFilePath() {
  return path.join(process.cwd(), "src", "data", "inventory.json");
}

async function readRecordsFile(): Promise<RecordItem[]> {
  const raw = await readFile(recordsFilePath(), "utf-8");
  return JSON.parse(raw) as RecordItem[];
}

async function readInventoryFile(): Promise<InventoryItem[]> {
  const raw = await readFile(inventoryFilePath(), "utf-8");
  return JSON.parse(raw) as InventoryItem[];
}

export async function getAllRecords(): Promise<RecordItem[]> {
  const records = await readRecordsFile();
  return [...records].sort((a, b) => a.artist.localeCompare(b.artist));
}

export async function getRecordById(id: string): Promise<RecordItem | null> {
  const records = await getAllRecords();
  return records.find((r) => r.id === id) ?? null;
}

// We'll use this for the "live stock" component in Stage 7.
export async function getInventoryByRecordId(
  recordId: string,
): Promise<InventoryItem | null> {
  const inventory = await readInventoryFile();
  return inventory.find((i) => i.recordId === recordId) ?? null;
}

export async function getFeaturedRecords(limit = 4): Promise<RecordItem[]> {
  const records = await getAllRecords();
  return records.slice(0, limit);
}
