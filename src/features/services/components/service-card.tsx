import Link from "next/link";
import type { Service } from "@prisma/client";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="rounded-lg border p-5 transition-shadow hover:shadow-md"
    >
      <h2 className="mb-2 font-semibold">{service.title}</h2>
      {service.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.description}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{service.durationMin} دقیقه</span>
        {service.price && (
          <span className="font-medium">
            {service.price.toLocaleString("fa-IR")} تومان
          </span>
        )}
      </div>
    </Link>
  );
}