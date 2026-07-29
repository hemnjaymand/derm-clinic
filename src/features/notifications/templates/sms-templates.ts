import { formatJalaliDateTime } from "@/lib/date";



// TODO(Task 13): این مقدار در آینده از Feature Settings (SiteSettings) خوانده می‌شود
const CLINIC_NAME = "کلینیک Drem";

type TemplateParams = {
  patientName: string;
  serviceTitle: string;
  startAt: Date;
};

export function bookingSmsTemplate({ patientName, serviceTitle, startAt }: TemplateParams): string {
  return `${CLINIC_NAME}\n${patientName} عزیز، نوبت شما برای «${serviceTitle}» در تاریخ ${formatJalaliDateTime(
    startAt
  )} ثبت شد و در انتظار تأیید است.`;
}

export function confirmSmsTemplate({ patientName, serviceTitle, startAt }: TemplateParams): string {
  return `${CLINIC_NAME}\n${patientName} عزیز، نوبت شما برای «${serviceTitle}» در تاریخ ${formatJalaliDateTime(
    startAt
  )} تأیید شد.`;
}

export function cancelSmsTemplate({ patientName, serviceTitle, startAt }: TemplateParams): string {
  return `${CLINIC_NAME}\n${patientName} عزیز، نوبت شما برای «${serviceTitle}» در تاریخ ${formatJalaliDateTime(
    startAt
  )} لغو شد.`;
}

export function reminderSmsTemplate({ patientName, serviceTitle, startAt }: TemplateParams): string {
  return `${CLINIC_NAME}\n${patientName} عزیز، یادآوری می‌شود نوبت «${serviceTitle}» شما در تاریخ ${formatJalaliDateTime(
    startAt
  )} می‌باشد.`;
}