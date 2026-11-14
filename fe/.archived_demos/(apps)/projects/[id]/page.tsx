import { redirect } from "next/navigation";

export default async function ProjectIdPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    redirect(`/projects/${id}/overview`);
}
