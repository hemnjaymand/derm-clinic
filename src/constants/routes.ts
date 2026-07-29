export const PUBLIC_ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  gallery: "/gallery",
  blog: "/blog",
  appointment: "/appointment",
  contact: "/contact",
} as const;

export const DASHBOARD_ROUTES = {
  root: "/dashboard",
  appointments: "/dashboard/appointments",
  patients: "/dashboard/patients",
  services: "/dashboard/services",
  gallery: "/dashboard/gallery",
  blog: "/dashboard/blog",
  workingHours: "/dashboard/working-hours",
  holidays: "/dashboard/holidays",
  settings: "/dashboard/settings",
  pageBanners: "/dashboard/page-banners",
  homeContent: "/dashboard/home-content",
} as const;

export const PUBLIC_NAV_ITEMS = [
  { label: "خانه", href: PUBLIC_ROUTES.home, icon: "Home" },
  { label: "درباره ما", href: PUBLIC_ROUTES.about, icon: "Info" },
  { label: "خدمات", href: PUBLIC_ROUTES.services, icon: "Stethoscope" },
  { label: "گالری", href: PUBLIC_ROUTES.gallery, icon: "Image" },
  { label: "مقالات", href: PUBLIC_ROUTES.blog, icon: "Newspaper" },
  { label: "تماس با ما", href: PUBLIC_ROUTES.contact, icon: "Phone" },
] as const;
export const DASHBOARD_NAV_ITEMS = [
  { label: "داشبورد", href: DASHBOARD_ROUTES.root, icon: "LayoutDashboard" },
  {
    label: "نوبت‌ها",
    href: DASHBOARD_ROUTES.appointments,
    icon: "CalendarCheck",
  },
  { label: "بیماران", href: DASHBOARD_ROUTES.patients, icon: "Users" },
  { label: "خدمات", href: DASHBOARD_ROUTES.services, icon: "Stethoscope" },
  { label: "گالری", href: DASHBOARD_ROUTES.gallery, icon: "Image" },
  { label: "مقالات", href: DASHBOARD_ROUTES.blog, icon: "Newspaper" },
  { label: "ساعات کاری", href: DASHBOARD_ROUTES.workingHours, icon: "Clock" },
  { label: "تعطیلات", href: DASHBOARD_ROUTES.holidays, icon: "CalendarOff" },
  { label: "تنظیمات", href: DASHBOARD_ROUTES.settings, icon: "Settings" },
  { label: "بنرهای صفحات", href: DASHBOARD_ROUTES.pageBanners, icon: "Image" },
  {
    label: "محتوای صفحه اصلی",
    href: DASHBOARD_ROUTES.homeContent,
    icon: "LayoutDashboard",
  },
] as const;
