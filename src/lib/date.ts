import { toJalaali, toGregorian } from "jalaali-js";

const TEHRAN_TZ = "Asia/Tehran";

/**
 * تبدیل تاریخ+ساعت شمسی (ورودی کاربر، به وقت محلی تهران) به Date با UTC —
 * همینو برای ذخیره در Prisma (فیلدهای DateTime) استفاده کن.
 */
export function jalaliToUtcDate(
  jy: number,
  jm: number,
  jd: number,
  hour = 0,
  minute = 0,
): Date {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);

  // ساخت زمان به‌عنوان "لحظه‌ی محلی تهران"، سپس تبدیل صحیح به UTC
  // با محاسبه‌ی افست واقعی تهران (که DST نداره، اما این روش برای هر تغییر احتمالی هم درسته)
  const utcGuess = new Date(Date.UTC(gy, gm - 1, gd, hour, minute));
  const tehranOffsetMinutes = getTehranOffsetMinutes(utcGuess);

  return new Date(utcGuess.getTime() - tehranOffsetMinutes * 60_000);
}

/** پارس رشته‌ی "HH:mm" همراه با تاریخ شمسی، خروجی Date به UTC */
export function jalaliDateAndTimeStringToUtc(
  jalaliDate: { jy: number; jm: number; jd: number },
  timeString: string,
): Date {
  const [hour, minute] = timeString.split(":").map(Number);
  return jalaliToUtcDate(
    jalaliDate.jy,
    jalaliDate.jm,
    jalaliDate.jd,
    hour,
    minute,
  );
}

/** تبدیل یک Date (UTC، از دیتابیس) به آبجکت تاریخ شمسی بر اساس وقت تهران */
export function utcDateToJalali(date: Date): {
  jy: number;
  jm: number;
  jd: number;
} {
  const tehranDate = toTehranWallClock(date);
  return toJalaali(
    tehranDate.getFullYear(),
    tehranDate.getMonth() + 1,
    tehranDate.getDate(),
  );
}

/** نمایش تاریخ شمسی به فرمت "۱۴۰۴/۰۴/۲۷" */
export function formatJalaliDate(date: Date): string {
  const { jy, jm, jd } = utcDateToJalali(date);
  return `${jy}/${pad(jm)}/${pad(jd)}`;
}

/** نمایش ساعت محلی تهران به فرمت "HH:mm" */
export function formatTehranTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TEHRAN_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/** نمایش کامل شمسی + ساعت، مناسب پیامک و UI */
export function formatJalaliDateTime(date: Date): string {
  return `${formatJalaliDate(date)} - ${formatTehranTime(date)}`;
}

// ---------- Internal helpers ----------

function toTehranWallClock(date: Date): Date {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TEHRAN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  return new Date(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
}

function getTehranOffsetMinutes(referenceUtc: Date): number {
  const tehranWallClock = toTehranWallClock(referenceUtc);
  return Math.round(
    (tehranWallClock.getTime() - referenceUtc.getTime()) / 60_000,
  );
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
