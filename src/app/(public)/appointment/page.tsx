import { BookingForm } from "@/features/appointments/components/booking-form";
import { getActiveServices } from "@/features/services/actions/services.actions";

export default async function AppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ serviceId?: string }>;
}) {
  const { serviceId } = await searchParams;
  const services = await getActiveServices();

  return (
    <div className="container mx-auto max-w-xl px-4 py-12" dir="rtl">
      <h1 className="mb-8 text-2xl font-bold">رزرو نوبت</h1>
      <BookingForm services={services} defaultServiceId={serviceId} />
    </div>
  );
}