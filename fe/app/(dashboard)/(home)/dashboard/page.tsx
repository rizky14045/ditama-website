import { getSeoMeta } from "@/lib/get-seo-meta";
import DashboardPageView from "./page-view";
import { getDictionary } from "@/app/dictionaries";

interface DashboardProps {
  params?: Promise<{
    lang?: any;
  }>;
}
export const metadata = getSeoMeta({
  title: "Dashboard",
  description: "DashTail Dashboard",
});
const Dashboard = async (props: DashboardProps) => {
  const trans = await getDictionary("en");
  return <DashboardPageView trans={trans} />;
};

export default Dashboard;
