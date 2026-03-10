import { redirect } from "next/navigation";
export default async function DealerRedirect({ params }: { params: Promise<{ url: string }> }) {
  const { url } = await params;
  redirect(`/used-car-dealers-in/india/${url}`);
}
