"use server";

import { siteConfig } from "@/data/landing-data";

export type LeadResponse = {
  success: boolean;
  error?: string;
  redirectUrl?: string;
  message?: string;
};

export async function submitLead(formData: FormData): Promise<LeadResponse> {
  const fullName = formData.get("fullName")?.toString().trim() || "Не указано";
  const phone = formData.get("phone")?.toString().trim() || "";
  const serviceTitle = formData.get("service")?.toString().trim() || "Не выбрана";
  const paymentType = formData.get("paymentType")?.toString().trim() || "inquiry";
  const agree = formData.get("agree") ? "Да (подтверждено)" : "Нет";

  if (!phone || phone.length < 6) {
    return { success: false, error: "Пожалуйста, введите корректный номер телефона." };
  }

  const selectedService = siteConfig.services.find((s) => s.title === serviceTitle);
  const price = selectedService ? selectedService.numericPrice : 5000;

  const prodamusEnvUrl = process.env.PRODAMUS_URL?.trim();
  const hasActivePaymentGateway = Boolean(prodamusEnvUrl && prodamusEnvUrl.startsWith("http"));

  const isOnlinePayment = paymentType === "pay" && hasActivePaymentGateway;
  const statusLabel = isOnlinePayment
    ? "💳 ПЕРЕХОД К ОНЛАЙН-ОПЛАТЕ ЧЕРЕЗ ПРОДАМУС"
    : paymentType === "pay"
    ? "📩 ЗАЯВКА НА ОПЛАТУ (ПЛАТЕЖНЫЙ ШЛЮЗ НЕ ПОДКЛЮЧЕН)"
    : "📩 ЗАЯВКА НА КОНСУЛЬТАЦИЮ / ЗАПИСЬ";

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const apiBase = (process.env.TELEGRAM_API_BASE || "https://api.telegram.org").replace(/\/+$/, "");

  const text = `<b>${statusLabel}</b>\n\n<b>Услуга:</b> ${serviceTitle}\n<b>Сумма:</b> ${price} ₽\n<b>ФИО:</b> ${fullName}\n<b>Телефон:</b> ${phone}\n<b>Согласие на ОПД:</b> ${agree}\n<b>Время:</b> ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} (МСК)`;

  if (token && chatId) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      await fetch(`${apiBase}/bot${token}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
    } catch {
    }
  }

  if (isOnlinePayment && prodamusEnvUrl) {
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const prodamusUrl = new URL(prodamusEnvUrl);
    prodamusUrl.searchParams.set("do", "pay");
    prodamusUrl.searchParams.set("products[0][name]", serviceTitle);
    prodamusUrl.searchParams.set("products[0][price]", price.toString());
    prodamusUrl.searchParams.set("products[0][quantity]", "1");
    prodamusUrl.searchParams.set("customer_phone", cleanPhone);
    prodamusUrl.searchParams.set("customer_extra", fullName);

    return { 
      success: true, 
      redirectUrl: prodamusUrl.toString() 
    };
  }

  return { 
    success: true,
    message: paymentType === "pay" && !hasActivePaymentGateway 
      ? "Заявка принята! Елена свяжется с вами и выставит официальный счет на оплату."
      : undefined
  };
}