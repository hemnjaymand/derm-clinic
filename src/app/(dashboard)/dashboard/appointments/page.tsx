// app/(dashboard)/appointments/page.tsx
"use client";

import { useEffect, useReducer, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AppointmentFilters } from "@/features/appointments/components/appointment-filters";
import { AppointmentTable } from "@/features/appointments/components/appointment-table";
import { getAppointments } from "@/features/appointments/actions/appointments.actions";
import type { AppointmentFilters as FiltersType } from "@/features/appointments/actions/appointments.actions";
import type { Appointment, Patient, Service, AppointmentStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// ============================================================
//  Types
// ============================================================
type AppointmentWithRelations = Appointment & {
  patient: Patient;
  service: Service;
};

type State = {
  loading: boolean;
  appointments: AppointmentWithRelations[];
  error: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: AppointmentWithRelations[] }
  | { type: "FETCH_ERROR"; payload: string };

// ============================================================
//  Reducer
// ============================================================
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { loading: false, appointments: action.payload, error: null };
    case "FETCH_ERROR":
      return { loading: false, appointments: [], error: action.payload };
    default:
      return state;
  }
}

// ============================================================
//  Component
// ============================================================
export default function AppointmentsPage() {
  const searchParams = useSearchParams();

  // ===== state =====
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    appointments: [],
    error: null,
  });

  // ===== فیلترها از URL (بدون any) =====
  const filters: FiltersType = useMemo(() => ({
    status: (searchParams.get("status") || undefined) as AppointmentStatus | undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    patientName: searchParams.get("patientName") || undefined,
  }), [searchParams]);

  // ===== تابع بارگذاری داده =====
  const loadAppointments = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await getAppointments(filters);
      dispatch({ type: "FETCH_SUCCESS", payload: data as AppointmentWithRelations[] });
    } catch (error) {
      console.error("خطا در دریافت نوبت‌ها:", error);
      toast.error("خطا در دریافت لیست نوبت‌ها");
      dispatch({ type: "FETCH_ERROR", payload: "خطا در دریافت داده" });
    }
  }, [filters]);

  // ===== اجرا در اولین رندر و تغییر فیلترها =====
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // ===== نمایش لودینگ =====
  if (state.loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ===== رندر اصلی =====
  return (
    <div className="space-y-6" dir="rtl">
      {/* عنوان و تعداد */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">مدیریت نوبت‌ها</h1>
        <div className="text-sm text-muted-foreground">
          {state.appointments.length} نوبت یافت شد
        </div>
      </div>

      {/* فیلترها */}
      <AppointmentFilters />

      {/* جدول / کارت‌ها */}
      <AppointmentTable appointments={state.appointments} />
    </div>
  );
}