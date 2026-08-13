import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatJalaliDate } from "@/lib/date";
import type { PatientListRow } from "@/features/patients/actions/patients.actions";

export function PatientTable({ patients }: { patients: PatientListRow[] }) {
  if (patients.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/35 p-8 text-center" dir="rtl">
        <p className="text-sm text-muted-foreground">بیماری یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card/35 shadow-sm overflow-hidden" dir="rtl">
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[650px]">
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="whitespace-nowrap text-right font-bold text-foreground py-4 px-6">نام</TableHead>
              <TableHead className="whitespace-nowrap text-right font-bold text-foreground py-4 px-6">شماره موبایل</TableHead>
              <TableHead className="whitespace-nowrap text-right font-bold text-foreground py-4 px-6">تعداد نوبت‌ها</TableHead>
              <TableHead className="whitespace-nowrap text-right font-bold text-foreground py-4 px-6">عضویت از</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} className="border-b border-border/40 transition-colors hover:bg-muted/50">
                <TableCell className="whitespace-nowrap py-4 px-6">
                  <Link
                    href={`/dashboard/patients/${patient.id}`}
                    className="inline-block py-1 font-medium text-foreground hover:text-primary transition-colors hover:underline"
                  >
                    {patient.firstName} {patient.lastName}
                  </Link>
                </TableCell>
                
                <TableCell dir="ltr" className="whitespace-nowrap text-right py-4 px-6 font-mono text-xs">
                  {patient.phone}
                </TableCell>
                
                <TableCell className="whitespace-nowrap py-4 px-6 font-medium">
                  {patient._count.appointments}
                </TableCell>
                
                <TableCell className="whitespace-nowrap py-4 px-6 text-muted-foreground">
                  {formatJalaliDate(patient.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}