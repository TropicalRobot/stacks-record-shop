import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { getDemoUser } from "@/lib/demoUser";

/**
 * Stage 8: Personalisation forces dynamic rendering
 * Any use of cookies()/headers() makes the route request-specific.
 */
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const jar = await cookies();
  const userId = jar.get("shop_user")?.value ?? null;

  const user = getDemoUser(userId);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="max-w-2xl text-muted-foreground">
          This page reads a cookie, so it must be rendered per request.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Signed in as</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">{user.name}</span>
            <Badge variant={user.tier === "member" ? "secondary" : "outline"}>
              {user.tier}
            </Badge>
          </div>

          <p className="text-muted-foreground">
            Cookie <span className="font-mono">shop_user</span>:{" "}
            <span className="font-mono">{userId ?? "(not set)"}</span>
          </p>

          <div className="flex flex-wrap gap-2">
            <form
              action={async () => {
                "use server";
                const jar = await cookies();
                jar.set("shop_user", "ryan", {
                  path: "/",
                  httpOnly: true,
                  sameSite: "lax",
                });
              }}
            >
              <Button type="submit">Set cookie (ryan)</Button>
            </form>

            <form
              action={async () => {
                "use server";
                const jar = await cookies();
                jar.delete("shop_user");
              }}
            >
              <Button type="submit" variant="secondary">
                Clear cookie
              </Button>
            </form>
          </div>

          <p className="text-muted-foreground">
            These buttons are Server Actions. They mutate a cookie, then the
            next request renders different content.
          </p>
        </CardContent>
      </Card>

      <DebugPanel
        pageName="account"
        notes={[
          "Stage 8: cookies() forces this route to be dynamic.",
          'We also set dynamic = "force-dynamic" for clarity.',
          "In production, renderedAt should change on every refresh.",
        ]}
      />
    </div>
  );
}
