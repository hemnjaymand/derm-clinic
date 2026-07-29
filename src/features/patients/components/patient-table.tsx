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
    return <p className="text-sm text-muted-foreground">بیماری یافت نشد.</p>;
  }

  return (
  // ۱. کانتینر اصلی: در موبایل اسکرول افقی می‌خورد اما در دسکتاپ عرض کامل را می‌گیرد
  <div className="w-full overflow-x-auto pb-4">
    {/* ۲. دادن حداقل عرض به جدول تا در موبایل فشرده نشود و اسکرول فعال شود */}
    <Table dir="rtl" className="w-full min-w-[650px]">
      <TableHeader>
        <TableRow>
          {/* ۳. whitespace-nowrap از رفتن کلمات به خط بعد جلوگیری می‌کند */}
          <TableHead className="whitespace-nowrap text-right">نام</TableHead>
          <TableHead className="whitespace-nowrap text-right">شماره موبایل</TableHead>
          <TableHead className="whitespace-nowrap text-right">تعداد نوبت‌ها</TableHead>
          <TableHead className="whitespace-nowrap text-right">عضویت از</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="whitespace-nowrap">
              <Link
                href={`/dashboard/patients/${patient.id}`}
                // ۴. inline-block و py-1 باعث می‌شود ناحیه لمس در موبایل بزرگتر و راحت‌تر باشد
                className="inline-block py-1 font-medium hover:underline"
              >
                {patient.firstName} {patient.lastName}
              </Link>
            </TableCell>
            
            {/* dir="ltr" و text-right که گذاشته بودی برای شماره تماس کاملاً اصولی و درست است */}
            <TableCell dir="ltr" className="whitespace-nowrap text-right">
              {patient.phone}
            </TableCell>
            
            <TableCell className="whitespace-nowrap">
              {patient._count.appointments}
            </TableCell>
            
            <TableCell className="whitespace-nowrap">
              {formatJalaliDate(patient.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
); }