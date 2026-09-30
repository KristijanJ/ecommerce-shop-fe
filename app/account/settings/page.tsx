import { getSession } from "@/app/lib/session";
import SettingsForm from "@/components/SettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getSession();

  if (!user) redirect("/login");

  return <SettingsForm user={user} />;
}
