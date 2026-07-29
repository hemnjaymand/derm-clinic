import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServiceBySlug } from "@/features/services/actions/services.actions";
import { ServiceDetail } from "@/features/services/components/service-detail";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return {};

  return {
    title: service.title,
    description: service.description?.slice(0, 160),
    openGraph: {
      title: service.title,
      description: service.description?.slice(0, 160),
      images: service.description ? [service.description] : undefined,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service || !service.isActive) {
    notFound();
  }

  return <ServiceDetail service={service} />;
}
