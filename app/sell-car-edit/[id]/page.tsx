import { redirect } from "next/navigation";
export default async function SellCarEditRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/sell-car-edit?vehicle_id=${id}`);
}
