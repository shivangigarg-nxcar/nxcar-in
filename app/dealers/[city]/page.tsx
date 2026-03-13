import { redirect } from "next/navigation";
export default async function DealersCityRedirect({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  redirect(`/used-car-dealers-in/${city}`);
}
