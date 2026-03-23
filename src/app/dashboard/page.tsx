import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/session";

// Central redirect hub — routes logged-in users to their dashboard
export default async function DashboardPage() {
  const { role } = await getAuthedUser();
  if (role === "provider") redirect("/provider/dashboard");
  redirect("/patient/dashboard");
}
