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
    ? "💳 ОНЛАЙН-ОПЛАТА (ПРОДАМУС)"
    : paymentType === "pay"
    ? "💳 ЗАЯВКА НА ОПЛАТУ (СБП / QR-КОД / РЕКВИЗИТЫ)"
    : "📩 ЗАЯВКА НА КОНСУЛЬТАЦИЮ / ЗАПИСЬ";

  const currentTime = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

  
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const rawTgChatId = process.env.TELEGRAM_CHAT_ID || "";
  const tgApiBase = (process.env.TELEGRAM_API_BASE || "https://api.telegram.org").replace(/\/+$/, "");

  const tgChatIds = rawTgChatId
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const tgMessage = `<b>${statusLabel}</b>\n\n` +
    `<b>Услуга:</b> ${serviceTitle}\n` +
    `<b>Сумма к оплате:</b> ${price} ₽\n` +
    `<b>ФИО клиента:</b> ${fullName}\n` +
    `<b>Телефон:</b> ${phone}\n` +
    `<b>Согласие на ОПД:</b> ${agree}\n` +
    `<b>Время:</b> ${currentTime} (МСК)`;

  if (tgToken && tgChatIds.length > 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      await Promise.allSettled(
        tgChatIds.map((chatId) =>
          fetch(`${tgApiBase}/bot${tgToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: tgMessage,
              parse_mode: "HTML",
            }),
            signal: controller.signal,
          })
        )
      );

      clearTimeout(timeout);
    } catch (err) {
      console.error("[TG Error]:", err);
    }
  }

  const vkToken = process.env.VK_BOT_TOKEN;
  const rawVkPeerId = process.env.VK_PEER_ID || "";

  const vkPeerIds = rawVkPeerId
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const vkMessage = `${statusLabel}\n\n` +
    `Услуга: ${serviceTitle}\n` +
    `Сумма к оплате: ${price} ₽\n` +
    `ФИО клиента: ${fullName}\n` +
    `Телефон: ${phone}\n` +
    `Согласие на ОПД: ${agree}\n` +
    `Время: ${currentTime} (МСК)`;

  if (vkToken && vkPeerIds.length > 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      await Promise.allSettled(
        vkPeerIds.map(async (peerId) => {
          const params = new URLSearchParams();
          params.append("access_token", vkToken);
          params.append("v", "5.199");
          params.append("peer_id", peerId);
          // random_id обязателен в VK API для защиты от дублирования сообщений
          params.append("random_id", String(Math.floor(Math.random() * 2147483647)));
          params.append("message", vkMessage);

          const response = await fetch("https://api.vk.com/method/messages.send", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
            signal: controller.signal,
          });

          const data = await response.json();
          if (data.error) {
            console.error(`[VK API Error to ${peerId}]:`, data.error);
          } else {
            console.log(`[VK Success to ${peerId}]: Message ID ${data.response}`);
          }
        })
      );

      clearTimeout(timeout);
    } catch (err) {
      console.error("[VK Network Error]:", err);
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
    message: paymentType === "pay"
      ? "Заявка зафиксирована! Для завершения оплаты отсканируйте QR-код или используйте банковские реквизиты."
      : "Заявка успешно отправлена! Елена свяжется с вами в течение рабочего дня."
  };
}