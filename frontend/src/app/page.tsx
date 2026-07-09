import { Dashboard } from "@/components/dashboard";
import { getSnapshot } from "@/lib/api";

export default async function Home() {
  const snapshot = await getSnapshot();
  return <Dashboard snapshot={snapshot} />;
}
