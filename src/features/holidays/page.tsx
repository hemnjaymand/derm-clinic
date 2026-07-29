import { getHolidays } from "./actions/holidays.actions";
import { HolidayFormDialog } from "./components/holiday-form-dialog";
import { HolidayList } from "./components/holiday-list";

export default async function HolidaysPage() {
  const holidays = await getHolidays();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">روزهای تعطیل</h1>
        <HolidayFormDialog />
      </div>
      <HolidayList holidays={holidays} />
    </div>
  );
}