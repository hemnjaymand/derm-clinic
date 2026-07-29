import { getPatients } from "@/features/patients/actions/patients.actions";
import { PatientSearch } from "@/features/patients/components/patient-search";
import { PatientTable } from "@/features/patients/components/patient-table";

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const patients = await getPatients(q);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">بیماران</h1>
      <PatientSearch />
      <PatientTable patients={patients} />
    </div>
  );
}