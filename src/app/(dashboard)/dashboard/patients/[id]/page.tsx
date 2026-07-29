import { notFound } from "next/navigation";
import { getPatientWithHistory } from "@/features/patients/actions/patients.actions";
import { PatientEditDialog } from "@/features/patients/components/patient-edit-dialog";
import { PatientAppointmentHistory } from "@/features/patients/components/patient-appointment-history";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await getPatientWithHistory(id);

  if (!patient) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{patient.id}</h1>
          <p dir="ltr" className="text-sm text-muted-foreground">
            {patient.phone}
          </p>
        </div>
        <PatientEditDialog patient={patient} />
      </div>

      {patient.nationalId && (
        <div className="rounded-md border bg-muted/30 p-4 text-sm">
          <span className="font-medium">یادداشت: </span>
          {patient.nationalId}
        </div>
      )}

      <div>
        <h2 className="mb-3 font-medium">تاریخچه‌ی نوبت‌ها</h2>
        <PatientAppointmentHistory appointments={patient.appointments} />
      </div>
    </div>
  );
}