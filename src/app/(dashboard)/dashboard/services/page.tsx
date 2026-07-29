import { getServices } from "@/features/services/actions/services.actions";
import { ServiceFormDialog } from "@/features/services/components/service-form-dialog";
import { ServiceTable } from "@/features/services/components/service-table";

export default async function DashboardServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">خدمات کلینیک</h1>
        <ServiceFormDialog />
      </div>
      <ServiceTable services={services} />
    </div>
  );
} 
