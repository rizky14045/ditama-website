import { getDictionary } from "@/app/dictionaries";
import EcommercePageView from "./page-view";
import { getSeoMeta } from "@/lib/get-seo-meta";

interface DashboardProps {
  params?: Promise<{
    lang?: any;
  }>;
}

export const metadata = getSeoMeta({
  title: "eCommerce",
  description: "DashTail eCommerce Dashboard",
});
const EcommercePage = async (props: DashboardProps) => {
  const trans = await getDictionary("en");
  return <EcommercePageView trans={trans} />;
};

export default EcommercePage;
