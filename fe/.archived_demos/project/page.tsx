import { getDictionary } from "@/app/dictionaries";
import ProjectPageView from "./page-view";
import { getSeoMeta } from "@/lib/get-seo-meta";

interface DashboardProps {
  params?: Promise<{
    lang?: any;
  }>;
}

export const metadata = getSeoMeta({
  title: "Project",
});

const ProjectPage = async (props: DashboardProps) => {
  const trans = await getDictionary("en");
  return <ProjectPageView trans={trans} />;
};

export default ProjectPage;
