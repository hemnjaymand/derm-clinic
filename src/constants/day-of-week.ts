/** 0=شنبه تا 6=جمعه (مطابق schema.prisma) */
export const DAY_OF_WEEK_ORDER: number[] = [0, 1, 2, 3, 4, 5, 6];

export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  0: "شنبه",
  1: "یکشنبه",
  2: "دوشنبه",
  3: "سه‌شنبه",
  4: "چهارشنبه",
  5: "پنجشنبه",
  6: "جمعه",
};
