import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type AuthedUser = {
  userId: string;
  role: "patient" | "provider";
};

/**
 * Call at the top of any protected server component or API route.
 * Redirects to /sign-in if not authenticated, /onboarding if no role set.
 */
export async function getAuthedUser(): Promise<AuthedUser> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const role = user?.publicMetadata?.role as "patient" | "provider" | undefined;
  if (!role) redirect("/onboarding");

  return { userId, role };
}

/**
 * Use in patient-only pages. Redirects to provider dashboard if wrong role.
 */
export async function requirePatient(): Promise<{ userId: string }> {
  const { userId, role } = await getAuthedUser();
  if (role !== "patient") redirect("/provider/dashboard");
  return { userId };
}

/**
 * Use in provider-only pages. Redirects to patient dashboard if wrong role.
 */
export async function requireProvider(): Promise<{ userId: string }> {
  const { userId, role } = await getAuthedUser();
  if (role !== "provider") redirect("/patient/dashboard");
  return { userId };
}
