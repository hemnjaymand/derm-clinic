import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const phone = process.env.SEED_ADMIN_PHONE ?? "09120000000";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { phone },
    update: {},
    create: { name: "دکتر", phone, passwordHash },
  });

  console.log(`✅ Admin seeded with phone: ${phone}`);
}

async function seedWorkingHours() {
  // dayOfWeek طبق کامنت خودِ schema.prisma: 0=شنبه ... 6=جمعه
  const DAYS = [
    { dayOfWeek: 0 }, // شنبه
    { dayOfWeek: 1 }, // یکشنبه
    { dayOfWeek: 2 }, // دوشنبه
    { dayOfWeek: 3 }, // سه‌شنبه
    { dayOfWeek: 4 }, // چهارشنبه
    { dayOfWeek: 5 }, // پنجشنبه
    { dayOfWeek: 6 }, // جمعه
  ];

  for (const day of DAYS) {
    await prisma.workingHours.upsert({
      where: { dayOfWeek: day.dayOfWeek },
      update: {},
      create: {
        dayOfWeek: day.dayOfWeek,
        isOpen: day.dayOfWeek !== 5, // پیش‌فرض: پنجشنبه تعطیل
        openTime: "09:00",
        closeTime: "17:00",
      },
    });
  }

  console.log("✅ Working hours seeded (7 days)");
}

async function seedSettings() {
  const defaults: { key: string; value: string; description: string }[] = [
    { key: "clinicName", value: "کلینیک Drem", description: "نام کلینیک" },
    { key: "phone", value: "021-00000000", description: "شماره تماس" },
    { key: "address", value: "", description: "آدرس کلینیک" },
    { key: "instagram", value: "", description: "آیدی اینستاگرام" },
    { key: "aboutText", value: "", description: "متن درباره‌ی ما" },
    { key: "heroImageUrl", value: "", description: "تصویر Hero صفحه اصلی" },
  ];

  for (const setting of defaults) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Default settings seeded");
}

async function seedServices() {
  const existingCount = await prisma.service.count();
  if (existingCount > 0) {
    console.log("↷ Services already exist, skipping");
    return;
  }

  const defaultServices = [
    { title: "مشاوره اولیه", durationMin: 30, order: 0 },
    { title: "بوتاکس", durationMin: 45, order: 1 },
    { title: "فیلر", durationMin: 60, order: 2 },
  ];

  await prisma.service.createMany({
    data: defaultServices.map((service) => ({
      ...service,
      slug: `${slugify(service.title)}-${Math.random().toString(36).slice(2, 7)}`,
      isActive: true,
    })),
  });

  console.log("✅ Default services seeded");
}

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

async function main() {
  await seedAdmin();
  await seedWorkingHours();
  await seedSettings();
  await seedServices();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });