export type DemoUser = {
  id: string;
  name: string;
  tier: "guest" | "member";
};

export function getDemoUser(userId?: string | null): DemoUser {
  if (!userId) {
    return { id: "guest", name: "Guest", tier: "guest" };
  }

  // Keep it deterministic for the tutorial.
  if (userId === "ryan") {
    return { id: "ryan", name: "Ryan", tier: "member" };
  }

  return { id: userId, name: "Member", tier: "member" };
}
