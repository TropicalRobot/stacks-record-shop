import { headers } from "next/headers";
import { Badge } from "@/components/ui/badge";

type StockResponse = {
  recordId: string;
  inStock: boolean;
  quantity: number;
  lastCheckedAt: string;
};

export async function LiveStock({ recordId }: { recordId: string }) {
  const h = await headers();

  const protocol =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  const host = h.get("host");

  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/stock/${recordId}`, {
    cache: "no-store",
  });

  const stock = (await res.json()) as StockResponse;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Badge variant={stock.inStock ? "secondary" : "outline"}>
        {stock.inStock ? `In stock (${stock.quantity})` : "Out of stock"}
      </Badge>
      <span className="text-muted-foreground">
        checked: <span className="font-mono">{stock.lastCheckedAt}</span>
      </span>
    </div>
  );
}
