import { getWorkingHours } from "@/features/working-hours/actions/working-hours.actions";
import { WorkingHoursForm } from "@/features/working-hours/components/working-hours-form";

export default async function WorkingHoursPage() {
  const workingHours = await getWorkingHours();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">ساعات کاری</h1>
      <WorkingHoursForm initialData={workingHours} />
    </div>
  );
}