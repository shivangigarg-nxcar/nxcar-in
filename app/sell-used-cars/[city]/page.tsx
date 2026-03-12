import { redirect } from "next/navigation";

export default async function SellUsedCarsCityRedirect({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  redirect(`/sell-used-car/${city}`);
}
