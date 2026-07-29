import Image from "next/image";
import { getPageBanner, getSiteSettings } from "@/features/settings/actions/settings.actions";
import { Award, Stethoscope, Star, Users, Shield, Sparkles, Heart, Clock, BadgeCheck } from "lucide-react";
import PageBanner from "@/components/shared/page-banner";

export const revalidate = 300;

export default async function AboutPage() {
    const [settings, banner] = await Promise.all([
        getSiteSettings(),
        getPageBanner("about"),
    ]);

    // آیکون‌های متنوع‌تر برای ویژگی‌ها
    const featureIcons = [Stethoscope, Award, Star, Users, Shield, Heart, Clock, BadgeCheck];

    return (
        <>
            {banner && <PageBanner fallbackTitle="درباره ما" banner={banner} />}

            <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 to-white dark:from-gray-950 dark:to-gray-900" dir="rtl">
                {/* ========== المان‌های تزئینی پس‌زمینه ========== */}
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-900/20" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-100/20 blur-3xl dark:bg-blue-900/10" />

                <div className="container relative mx-auto px-4 py-16 md:py-24">
                    {/* ========== هدر جایگزین (در صورت نبود بنر) ========== */}
                    {!banner && (
                        <div className="relative mb-20 text-center">
                            <div className="inline-block rounded-full bg-primary/10 px-6 py-2 text-sm font-semibold text-primary backdrop-blur-sm">
                                درباره ما
                            </div>
                            <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground md:text-6xl">
                                {settings.clinicName || "کلینیک زیبایی"}
                            </h1>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                                جایی که علم و هنر در خدمت زیبایی شماست
                            </p>
                            <div className="mt-6 flex justify-center gap-2">
                                <div className="h-1 w-12 rounded-full bg-gradient-to-l from-primary to-primary/60" />
                                <div className="h-1 w-4 rounded-full bg-primary/30" />
                            </div>
                        </div>
                    )}

                    {/* ========== بخش معرفی با طراحی شیشه‌ای ========== */}
                    <section className="relative mb-24">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
                            {/* تصویر با قاب هنری */}
                            {settings.heroImageUrl && (
                                <div className="relative group order-2 lg:order-1">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted shadow-2xl shadow-primary/10">
                                        <Image
                                            src={settings.heroImageUrl}
                                            alt={settings.clinicName || "کلینیک زیبایی"}
                                            fill
                                            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            unoptimized
                                            priority
                                        />
                                        {/* حاشیه‌ی درخشان */}
                                        <div className="absolute inset-0 rounded-3xl ring-2 ring-inset ring-white/20 transition-all duration-500 group-hover:ring-primary/40" />
                                    </div>
                                    {/* برچسب تزئینی روی تصویر */}
                                    <div className="absolute -bottom-4 -left-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-white/20">
                                        <p className="text-sm font-bold text-primary">✦ بیش از ۵ سال تجربه</p>
                                    </div>
                                </div>
                            )}

                            {/* متن با کارت شیشه‌ای */}
                            <div className={`order-1 lg:order-2 ${!settings.heroImageUrl && "lg:col-span-2"}`}>
                                <div className="relative rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 p-8 shadow-xl shadow-black/5">
                                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                                        خوش آمدید
                                    </span>
                                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                                        {settings.clinicName || "کلینیک زیبایی"}
                                    </h2>
                                    <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-l from-primary to-primary/40" />

                                    {settings.aboutText ? (
                                        <div
                                            className="prose prose-lg mt-6 max-w-none leading-relaxed text-foreground/80 marker:text-primary"
                                            dangerouslySetInnerHTML={{ __html: settings.aboutText }}
                                        />
                                    ) : (
                                        <div className="mt-6 space-y-4">
                                            <p className="text-lg leading-relaxed text-foreground/80">
                                                دکتر آسو جای مند با بیش از <strong className="text-foreground">۵ سال</strong> سابقه‌ی درخشان در حوزه‌ی سلامت و زیبایی پوست و مو، با بهره‌گیری از پیشرفته‌ترین متدهای روز دنیا، آماده‌ی ارائه‌ی خدمات تخصصی به شما عزیزان است.
                                            </p>
                                            <p className="leading-relaxed text-foreground/70">
                                                ما در این کلینیک، زیبایی را نه یک خدمات، بلکه یک هنر می‌دانیم و با ظریف‌ترین ابزارها و دانش روز، آن را به شما هدیه می‌دهیم.
                                            </p>
                                        </div>
                                    )}

                                    {/* آمار سریع (دکوراتیو) */}
                                    <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/50 pt-6">
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-primary">۵+</p>
                                            <p className="text-xs text-muted-foreground">سال تجربه</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-primary">۱۰۰۰+</p>
                                            <p className="text-xs text-muted-foreground">مراجع راضی</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-primary">۲۰+</p>
                                            <p className="text-xs text-muted-foreground">خدمت تخصصی</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ========== جداکننده هنری ========== */}
                    <div className="relative my-20 flex items-center justify-center">
                        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-lg border border-border">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                    </div>

                    {/* ========== ویژگی‌ها با طراحی مدرن ========== */}
                    {settings.features && settings.features.length > 0 && (
                        <section className="mb-24">
                            <div className="mb-14 text-center">
                                <span className="inline-block rounded-full bg-primary/10 px-5 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm">
                                    مزیت‌های رقابتی
                                </span>
                                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                                    چرا <span className="text-primary">{settings.clinicName || "ما"}</span> را انتخاب کنید؟
                                </h2>
                                <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                                    ویژگی‌هایی که تجربه‌ی شما را متحول می‌کند
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {settings.features.map((feature, index) => {
                                    const Icon = featureIcons[index % featureIcons.length];
                                    const colors = [
                                        "from-rose-500 to-pink-500",
                                        "from-violet-500 to-purple-500",
                                        "from-blue-500 to-cyan-500",
                                        "from-emerald-500 to-teal-500",
                                        "from-amber-500 to-orange-500",
                                        "from-indigo-500 to-blue-600",
                                        "from-pink-500 to-rose-500",
                                        "from-cyan-500 to-sky-500",
                                    ];
                                    const color = colors[index % colors.length];

                                    return (
                                        <div
                                            key={index}
                                            className="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-white/30 dark:border-gray-800/40 p-7 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/10"
                                        >
                                            {/* گرادیان دکوراتیو در گوشه */}
                                            <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-10 transition-all duration-700 group-hover:opacity-25 group-hover:scale-150`} />

                                            <div className="relative">
                                                {/* آیکون با پس‌زمینه‌ی گرادیان */}
                                                <div className={`mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg shadow-primary/20`}>
                                                    <Icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                                                </div>

                                                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                                    {feature.description}
                                                </p>

                                                {/* خط تزئینی در پایین */}
                                                <div className={`mt-5 h-1 w-12 rounded-full bg-gradient-to-l ${color} opacity-60 transition-all duration-500 group-hover:w-20`} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* ========== نقل قول با طراحی مینیمال و هنری ========== */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-white/80 to-transparent dark:from-primary/10 dark:via-gray-900/80 p-10 shadow-xl backdrop-blur-sm border border-primary/10 md:p-16">
                        {/* نقل قول‌های بزرگ تزئینی */}
                        <div className="absolute right-6 top-4 text-7xl text-primary/10 select-none font-serif leading-none opacity-30">
                            ❝
                        </div>
                        <div className="absolute bottom-4 left-6 text-7xl text-primary/10 rotate-180 select-none font-serif leading-none opacity-30">
                            ❝
                        </div>

                        <blockquote className="relative mx-auto max-w-3xl text-center">
                            <p className="text-2xl font-light leading-relaxed text-foreground/90 md:text-4xl md:leading-relaxed">
                                «زیبایی، زبانی است که نیازی به ترجمه ندارد. ما با هنر و دانش، این زبان را به بهترین شکل برای شما می‌گوییم.»
                            </p>
                            <footer className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                                <div className="h-px w-12 bg-gradient-to-l from-primary/60 to-transparent" />
                                <cite className="text-base font-semibold text-primary not-italic">
                                    دکتر {settings.clinicName || "آسو جای مند"}
                                </cite>
                                <div className="h-px w-12 bg-gradient-to-r from-primary/60 to-transparent" />
                            </footer>
                            <div className="mt-4 flex justify-center gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className="inline-block h-1.5 w-1.5 rounded-full bg-primary/40" />
                                ))}
                            </div>
                        </blockquote>
                    </section>

                    {/* ========== دعوت به اقدام (اختیاری) ========== */}
                    <div className="mt-20 text-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-primary to-primary/80 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl"
                        >
                            <span>همین حالا وقت بگیرید</span>
                            <span className="text-lg">←</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}