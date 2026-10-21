"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { siteConfig } from "@/data/landing-data";
import { submitLead } from "@/app/actions/lead";
import { 
  ArrowUpRight, 
  Check, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  CreditCard,
  Send,
  Loader2,
  ShieldCheck,
  Star,
  Copy,
  X,
  QrCode,
  Phone
} from "lucide-react";


export function PaymentModal({
  isOpen,
  onClose,
  serviceTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}) {
  const [activeTab, setActiveTab] = useState<"qr" | "requisites">("qr");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const requisites = [
    { label: "Получатель", value: "Бахарева Елена Арсеньевна", copyable: false },
    { label: "Банк-получатель", value: 'АО "ТБанк"', copyable: false },
    { label: "Номер счета", value: "40817810500010579844", copyable: true },
    { label: "БИК", value: "044525974", copyable: true },
    { label: "Корр. счет", value: "30101810145250000974", copyable: true },
    { label: "ИНН банка", value: "7710140679", copyable: true },
    { label: "КПП банка", value: "771301001", copyable: true },
  ];

  const paymentPurpose =
    "Перевод средств по договору № 5143024338 Бахарева Елена Арсеньевна НДС не облагается";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl transition-all"
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold block mb-1">
            Оплата услуг
          </span>
          <h3 className="text-xl font-extrabold text-[#0f2042]">
            {serviceTitle ? serviceTitle : "Перевод средств"}
          </h3>
          <p className="text-xs text-[#3b5987] mt-1">
            Выберите удобный способ перевода через СБП или реквизиты
          </p>
        </div>

        <div className="flex rounded-2xl bg-blue-50/70 p-1 mb-5 border border-blue-100">
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === "qr"
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "text-[#1E3A8A] hover:text-[#172554]"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR-код (СБП)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requisites")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === "requisites"
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "text-[#1E3A8A] hover:text-[#172554]"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Реквизиты счета</span>
          </button>
        </div>

        {activeTab === "qr" && (
          <div className="flex flex-col items-center text-center">
            <div className="rounded-2xl border-2 border-blue-100 bg-white p-3 shadow-sm mb-4">
              <img
                src="/qr-code.png"
                alt="QR-код для оплаты — Бахарева Елена Арсеньевна"
                className="w-56 h-auto rounded-xl object-contain mx-auto"
              />
            </div>
            <span className="text-xs font-bold text-[#0f2042] block">
              Бахарева Елена Арсеньевна
            </span>
            <span className="text-[11px] font-mono text-[#1E3A8A] font-semibold mt-0.5">
              Номер договора: 5143024338
            </span>
            <p className="text-xs text-[#3b5987] mt-3 max-w-xs">
              Отсканируйте камерой смартфона или в приложении любого банка для перевода через СБП
            </p>
          </div>
        )}


        {activeTab === "requisites" && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-3 space-y-2 text-xs">
              {requisites.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#3b5987]">
                      {item.label}
                    </span>
                    <span className="font-mono text-[#0f2042] text-xs font-medium break-all">
                      {item.value}
                    </span>
                  </div>
                  {item.copyable && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1E3A8A] border border-blue-200 shadow-sm hover:bg-blue-50 active:scale-95 transition cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === item.label ? "Скопировано!" : "Копия"}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  Назначение платежа (обязательно)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(paymentPurpose, "purpose")}
                  className="inline-flex items-center gap-1 rounded-lg bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-950 hover:bg-amber-300 active:scale-95 transition cursor-pointer"
                >
                  <Copy className="w-2.5 h-2.5" />
                  <span>{copiedKey === "purpose" ? "Скопировано!" : "Копировать"}</span>
                </button>
              </div>
              <p className="font-mono text-gray-800 text-[11px] leading-relaxed">
                {paymentPurpose}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-blue-50 pt-3 text-center">
          <p className="text-[11px] text-[#3b5987] mb-3 font-mono">
            После совершения оплаты отправьте чек Елене в мессенджер
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-[#1E3A8A] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#172554] shadow-md transition cursor-pointer"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { profile, socialLinks } = siteConfig;

  return (
    <header className="w-full border-b border-blue-100 bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-[#0f2042]">
            {profile.shortName}
          </span>
          <span className="text-[11px] text-[#1E3A8A] font-mono tracking-wide">
            {profile.handle}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#1e3a8a]/80">
          <a href="#services" className="hover:text-[#1d4ed8] transition-colors">
            Услуги
          </a>
          <a href="#about" className="hover:text-[#1d4ed8] transition-colors">
            Обо мне
          </a>
          <a href="#steps" className="hover:text-[#1d4ed8] transition-colors">
            Процесс
          </a>
          <a href="#reviews" className="hover:text-[#1d4ed8] transition-colors">
            Отзывы
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={socialLinks.telegramDirect}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] border border-blue-200 bg-blue-50/60 rounded-full px-3.5 py-1.5 hover:bg-blue-100 transition-colors"
          >
            <span>Написать в ТГ</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#1E3A8A]" />
          </Link>

          <a
            href="#lead-form"
            className="hidden sm:inline-flex text-xs font-semibold bg-[#1E3A8A] text-white rounded-full px-4 py-1.5 hover:bg-[#172554] shadow-sm shadow-blue-950/20 transition-colors"
          >
            Записаться
          </a>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   HERO
   ========================================================= */
export function Hero() {
  const { profile, socialLinks, contacts } = siteConfig;

  return (
    <section className="py-12 sm:py-20 border-b border-blue-100 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="inline-block text-xs uppercase tracking-widest font-mono font-semibold text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 mb-4">
              {profile.experienceYears}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0f2042] leading-[1.1] mb-6">
              Декларация со 100% гарантией
            </h1>

            <p className="text-base sm:text-lg text-[#274675] font-normal leading-relaxed max-w-xl mb-8">
              {profile.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <a
                href="#services"
                className="inline-flex items-center justify-center text-xs uppercase tracking-wider font-bold bg-[#1E3A8A] text-white px-6 py-3.5 rounded-full hover:bg-[#172554] shadow-md shadow-blue-950/20 transition-all"
              >
                Выбрать услугу
              </a>
              <a
                href="#lead-form"
                className="inline-flex items-center justify-center text-xs uppercase tracking-wider font-bold border border-blue-200 text-[#1E3A8A] bg-white px-6 py-3.5 rounded-full hover:bg-blue-50 transition-all"
              >
                Оставить заявку
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={`tel:${contacts.phone.replace(/[^\d+]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#0f2042] bg-white border border-blue-200 shadow-sm hover:border-blue-400 hover:bg-blue-50/70 transition-all"
              >
                <Phone className="w-3 h-3 text-[#1E3A8A]" />
                <span>{contacts.phone}</span>
              </a>

              <Link
                href={socialLinks.telegramDirect}
                target="_blank"
                className="group relative inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-sm shadow-blue-900/20 hover:shadow-md hover:shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1">
                  Telegram
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 pointer-events-none" />
              </Link>

              <Link
                href={socialLinks.whatsapp}
                target="_blank"
                className="group relative inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 shadow-sm shadow-blue-900/20 hover:shadow-md hover:shadow-cyan-600/30 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1">
                  WhatsApp
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 pointer-events-none" />
              </Link>

              <Link
                href={socialLinks.max}
                target="_blank"
                className="group relative inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 shadow-sm shadow-blue-900/20 hover:shadow-md hover:shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1">
                  МАКС
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 pointer-events-none" />
              </Link>

              <Link
                href={socialLinks.vk}
                target="_blank"
                className="group relative inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 shadow-sm shadow-blue-900/20 hover:shadow-md hover:shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1">
                  ВКонтакте
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 pointer-events-none" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden border-2 border-blue-100 bg-white shadow-xl shadow-blue-950/5">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={profile.avatarVideo} type="video/mp4" />
                <img
                  src={profile.avatarGif}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </video>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-12 border-t border-blue-100">
          {profile.stats.map((s, i) => (
            <div key={i} className="flex flex-col p-4 rounded-2xl bg-white border border-blue-100 shadow-sm">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] tracking-tight">
                {s.value}
              </span>
              <span className="text-xs text-[#3b5987] uppercase tracking-wider font-mono mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services({ 
  services = siteConfig.services 
}: { 
  services?: typeof siteConfig.services 
}) {
  const items = services.length > 0 ? services : siteConfig.services;

  const handleSelectServiceAction = (title: string, type: "pay" | "inquiry") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("select-lead-service", {
          detail: { service: title, type },
        })
      );

      const target = document.getElementById("lead-form");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          const input = target.querySelector<HTMLInputElement>('input[name="fullName"]');
          if (input) {
            input.focus();
          }
        }, 500);
      }
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 border-b border-blue-100 bg-white scroll-mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A8A] block mb-2 font-semibold">
              Прайс-лист
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2042] tracking-tight">
              Услуги и стоимость
            </h2>
          </div>
          <p className="text-xs text-[#3b5987] mt-2 sm:mt-0 font-mono">
            Работаю онлайн по всей России • Оплата картой, QR или по счету
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-7 rounded-3xl border border-blue-100 bg-white flex flex-col justify-between hover:border-[#1E3A8A] hover:shadow-lg hover:shadow-blue-950/5 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#3b5987] mb-4 pb-3 border-b border-blue-50">
                  <span>{item.term}</span>
                  <span className="font-extrabold text-[#1E3A8A] text-sm">
                    {item.price}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0f2042] mb-2.5 tracking-tight min-h-[48px]">
                  {item.title}
                </h3>

                <p className="text-xs text-[#274675] leading-relaxed mb-6">
                  {item.desc}
                </p>

                <ul className="space-y-2 mb-8">
                  {item.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#274675] leading-normal">
                      <Check className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSelectServiceAction(item.title, "pay")}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-3 rounded-full bg-[#1E3A8A] text-white hover:bg-[#172554] shadow-sm shadow-blue-950/20 transition-all cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Оплатить (QR / Реквизиты)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectServiceAction(item.title, "inquiry")}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2.5 rounded-full border border-blue-200 text-[#1E3A8A] hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <span>Записаться / Вопрос</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#1E3A8A]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export function Principles() {
  const { advantages } = siteConfig;

  return (
    <section className="py-16 sm:py-24 border-b border-blue-100 bg-blue-50/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A8A] block mb-2 font-semibold">
            Стандарты
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2042] tracking-tight">
            Принципы сотрудничества
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((item) => (
            <div key={item.id} className="flex flex-col border-t-2 border-[#1E3A8A] pt-6">
              <span className="text-xs font-mono font-bold text-[#1E3A8A] mb-3 block">
                {item.number}
              </span>
              <h3 className="text-base font-bold text-[#0f2042] mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#274675] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export function About() {
  const { aboutMe } = siteConfig;

  // Автоматически применяем фразу «занимаюсь еще и преподаванием...»
  const updatedAboutText = aboutMe.text
    ? aboutMe.text.replace("занимаюсь преподаванием", "занимаюсь еще и преподаванием")
    : "Практикую учет с 1998 года. 23 года руководила подразделениями в коммерческом банке, а с 2024 года полностью сосредоточена на рынке бухгалтерских услуг для физических лиц и предпринимателей. С 2026 года занимаюсь еще и преподаванием в федеральной Школе финансовых экспертов Ольги Красновой.";

  return (
    <section id="about" className="py-16 sm:py-24 border-b border-blue-100 bg-white scroll-mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A8A] block mb-2 font-semibold">
              Квалификация
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2042] tracking-tight mb-4">
              {aboutMe.title}
            </h2>
            <p className="text-xs font-mono text-[#3b5987]">
              {aboutMe.subtitle}
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-between">
            <p className="text-base sm:text-lg text-[#1e3a8a] leading-relaxed mb-6 font-normal">
              {updatedAboutText}
            </p>

            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-[#3b5987] block font-semibold">
                Профессиональный опыт
              </span>
              {aboutMe.careerMilestones.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs sm:text-sm">
                  <span className="font-extrabold text-[#0f2042] block font-mono text-xs mb-0.5">{m.years}</span>
                  <span className="text-[#274675] font-medium">{m.role}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-[#3b5987] block mb-2 font-semibold">
                Дипломы и аттестаты
              </span>
              {aboutMe.education.map((edu, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white border border-blue-100 text-xs text-[#172554]"
                >
                  {edu}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export function Steps() {
  const { steps } = siteConfig;

  return (
    <section id="steps" className="py-16 sm:py-24 border-b border-blue-100 bg-white scroll-mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A8A] block mb-2 font-semibold">
            Маршрут
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2042] tracking-tight">
            Как строится работа
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div 
              key={st.step} 
              className="p-6 rounded-3xl border border-blue-100 bg-white flex flex-col justify-start hover:border-[#1E3A8A] hover:shadow-md hover:shadow-blue-950/5 transition-all"
            >
              <span className="text-xs font-mono font-bold text-[#1E3A8A] mb-4 block">
                /{st.step}
              </span>
              <h3 className="text-sm font-bold text-[#0f2042] mb-2">
                {st.title}
              </h3>
              <p className="text-xs text-[#274675] leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reviews({ 
  reviews = siteConfig.reviews 
}: { 
  reviews?: typeof siteConfig.reviews 
}) {
  const [idx, setIdx] = useState(0);
  const items = reviews.length > 0 ? reviews : siteConfig.reviews;

  return (
    <section id="reviews" className="py-16 sm:py-24 border-b border-blue-100 bg-blue-50/40 scroll-mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A8A] block mb-2 font-semibold">
              Отклики
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2042] tracking-tight">
              Отзывы клиентов
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIdx((prev) => (prev - 1 + items.length) % items.length)}
              className="p-2 rounded-full border border-blue-200 bg-white text-[#1E3A8A] hover:bg-blue-50 transition-colors cursor-pointer"
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIdx((prev) => (prev + 1) % items.length)}
              className="p-2 rounded-full border border-blue-200 bg-white text-[#1E3A8A] hover:bg-blue-50 transition-colors cursor-pointer"
              aria-label="Следующий отзыв"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="flex items-center gap-1 text-amber-400 mb-4">
            {[...Array(items[idx].rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <p className="text-base sm:text-xl text-[#1e3a8a] leading-relaxed mb-6 font-normal">
            «{items[idx].text}»
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-4 border-t border-blue-50">
            <span className="text-xs font-bold text-[#0f2042] uppercase tracking-wider">
              {items[idx].author}
            </span>
            <span className="text-xs font-mono text-[#1E3A8A] font-medium">
              {items[idx].service}
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={siteConfig.avitoReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-3xl border border-blue-100 bg-white flex items-center justify-between hover:border-[#1E3A8A] hover:shadow-sm transition-all"
          >
            <div>
              <span className="font-bold text-xs text-[#0f2042] block">Отзывы на Авито</span>
              <span className="text-[11px] text-[#3b5987] font-mono">Больше оценок и подтвержденных сделок</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#1E3A8A]" />
          </a>

          <a
            href={siteConfig.tgReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-3xl border border-blue-100 bg-white flex items-center justify-between hover:border-[#1E3A8A] hover:shadow-sm transition-all"
          >
            <div>
              <span className="font-bold text-xs text-[#0f2042] block">Отзывы в Telegram</span>
              <span className="text-[11px] text-[#3b5987] font-mono">Скрины благодарностей по тегу #отзывы</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#1E3A8A]" />
          </a>
        </div>
      </div>
    </section>
  );
}


export function LeadForm({ 
  services = siteConfig.services 
}: { 
  services?: typeof siteConfig.services 
}) {
  const { privacyPolicyUrl } = siteConfig;
  const items = services.length > 0 ? services : siteConfig.services;
  const [selectedService, setSelectedService] = useState(items[0].title);
  const [paymentType, setPaymentType] = useState<"pay" | "inquiry">("pay");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [customSuccessMessage, setCustomSuccessMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    const handleSelectService = (e: Event) => {
      const customEvent = e as CustomEvent<{ service?: string; type?: "pay" | "inquiry" }>;
      if (customEvent.detail?.service) {
        setSelectedService(customEvent.detail.service);
      }
      if (customEvent.detail?.type) {
        setPaymentType(customEvent.detail.type);
      }
    };

    window.addEventListener("select-lead-service", handleSelectService);
    return () => window.removeEventListener("select-lead-service", handleSelectService);
  }, []);

  const activeServiceObj = items.find((s) => s.title === selectedService) || items[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("service", selectedService);
    formData.set("paymentType", paymentType);

    const res = await submitLead(formData);

    setLoading(false);

    if (res.success) {
      if (paymentType === "pay") {
        setIsQrModalOpen(true);
        setCustomSuccessMessage(
          "Заявка зафиксирована! Для завершения оплаты отсканируйте QR-код или используйте банковские реквизиты."
        );
      } else {
        if (res.message) {
          setCustomSuccessMessage(res.message);
        }
      }
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || "Произошла ошибка при отправке.");
    }
  }

  return (
    <>
      <section id="lead-form" className="py-16 sm:py-24 border-b border-blue-100 bg-white scroll-mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A8A] block mb-2 font-semibold">
              Запись и оплата
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2042] tracking-tight">
              Оформить услугу или задать вопрос
            </h2>
            <p className="text-xs sm:text-sm text-[#274675] mt-2">
              Заполните контактные данные для регистрации заявки и перейдите к оплате через СБП или реквизиты.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 sm:p-12 rounded-3xl border border-blue-100 bg-blue-50/50 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#1E3A8A] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#0f2042] mb-1">
                Заявка успешно отправлена
              </h3>
              <p className="text-xs sm:text-sm text-[#274675] mb-6">
                {customSuccessMessage || "Елена Бахарева свяжется с вами в течение рабочего дня."}
              </p>

              {paymentType === "pay" && (
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E3A8A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#172554] transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Показать QR-код и реквизиты</span>
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-950/5 space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#3b5987] mb-2 font-semibold">
                  1. Выберите услугу
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedService(srv.title)}
                      className={`p-3 text-left rounded-2xl border text-xs transition-all cursor-pointer ${
                        selectedService === srv.title
                          ? "border-[#1E3A8A] bg-[#1E3A8A] text-white font-semibold shadow-sm"
                          : "border-blue-100 bg-blue-50/30 text-[#1e3a8a] hover:border-blue-300"
                      }`}
                    >
                      <div className="font-bold line-clamp-1">{srv.title}</div>
                      <div className={selectedService === srv.title ? "text-blue-100" : "text-[#1d4ed8] font-semibold mt-0.5"}>
                        {srv.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#3b5987] mb-2 font-semibold">
                  2. Формат обращения
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType("pay")}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      paymentType === "pay"
                        ? "border-[#1E3A8A] bg-blue-50/70 text-[#0f2042] ring-1 ring-[#1E3A8A]"
                        : "border-blue-100 bg-white text-[#274675] hover:border-blue-300"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mt-0.5 text-[#1E3A8A] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#0f2042]">Оплатить онлайн</div>
                      <div className="text-[11px] text-[#3b5987] mt-0.5">
                        СБП (QR-код), счет Т-Банк
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType("inquiry")}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      paymentType === "inquiry"
                        ? "border-[#1E3A8A] bg-blue-50/70 text-[#0f2042] ring-1 ring-[#1E3A8A]"
                        : "border-blue-100 bg-white text-[#274675] hover:border-blue-300"
                    }`}
                  >
                    <Send className="w-4 h-4 mt-0.5 text-[#1E3A8A] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#0f2042]">Оставить заявку</div>
                      <div className="text-[11px] text-[#3b5987] mt-0.5">
                        Консультация и согласование в мессенджере
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#3b5987] mb-1.5 font-semibold">
                    Ваше ФИО <span className="text-[#1E3A8A]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Иванова Анна Сергеевна"
                    className="w-full px-4 py-3 rounded-2xl bg-blue-50/20 border border-blue-100 text-xs sm:text-sm text-[#0f2042] placeholder-[#3b5987]/50 focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#3b5987] mb-1.5 font-semibold">
                    Телефон <span className="text-[#1E3A8A]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-4 py-3 rounded-2xl bg-blue-50/20 border border-blue-100 text-xs sm:text-sm text-[#0f2042] placeholder-[#3b5987]/50 focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  required
                  className="mt-0.5 rounded border-blue-300 text-[#1E3A8A] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="agree" className="text-xs text-[#274675] leading-normal cursor-pointer">
                  Я соглашаюсь на{" "}
                  <a
                    href={privacyPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E3A8A] underline underline-offset-2 hover:text-[#172554] font-medium"
                  >
                    обработку персональных данных
                  </a>
                </label>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-mono">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-full bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs uppercase tracking-widest shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : paymentType === "pay" ? (
                  `Перейти к оплате (${activeServiceObj.numericPrice} ₽)`
                ) : (
                  "Отправить заявку"
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#3b5987] font-mono pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Оплата на счет Т-Банк (Бахарева Е. А.) • СБП</span>
              </div>
            </form>
          )}
        </div>
      </section>

      <PaymentModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        serviceTitle={selectedService}
      />
    </>
  );
}


export function Footer() {
  const { profile, socialLinks, contacts } = siteConfig;

  return (
    <footer className="py-12 bg-[#0c1829] text-blue-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-blue-900/40">
          <div>
            <span className="text-sm font-bold text-white block">
              {profile.name}
            </span>
            <span className="text-xs text-blue-300/80 font-mono block mt-0.5">
              {profile.role} • {contacts.phone}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-wider">
            <Link href={socialLinks.telegramChannel} target="_blank" className="hover:text-white transition-colors">
              Канал TG
            </Link>
            <Link href={socialLinks.telegramDirect} target="_blank" className="hover:text-white transition-colors">
              Личка TG
            </Link>
            <Link href={socialLinks.whatsapp} target="_blank" className="hover:text-white transition-colors">
              WhatsApp
            </Link>
            <Link href={socialLinks.max} target="_blank" className="hover:text-white transition-colors">
              МАКС
            </Link>
            <Link href={socialLinks.vk} target="_blank" className="hover:text-white transition-colors">
              ВКонтакте
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-blue-400 font-mono gap-2">
          <span>© {new Date().getFullYear()} {profile.name}. Все права защищены.</span>
          <a href={siteConfig.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </footer>
  );
}