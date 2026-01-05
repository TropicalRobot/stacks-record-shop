import { NextResponse } from "next/server";
import { getInventoryByRecordId } from "@/lib/data/records";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const inv = await getInventoryByRecordId(id);

  // Simulate "live" freshness metadata
  const now = new Date().toISOString();

  return NextResponse.json({
    recordId: id,
    inStock: inv?.inStock ?? false,
    quantity: inv?.quantity ?? 0,
    lastCheckedAt: now,
  });
}
