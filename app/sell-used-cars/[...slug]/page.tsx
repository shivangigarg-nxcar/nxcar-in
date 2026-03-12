import { redirect } from "next/navigation";

export default async function SellUsedCarsRedirect({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  redirect(`/sell-used-car/${slug.join("/")}`);
}
