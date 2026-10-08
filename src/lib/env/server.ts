import "server-only";

import { getPublicEnv } from "@/lib/env/public";

export function getServerEnv() {
  return {
    ...getPublicEnv(),
    geminiApiKey: process.env.GEMINI_API_KEY?.trim() ?? "",
    geminiModel: process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
    razorpayKeyId: process.env.RAZORPAY_KEY_ID?.trim() ?? "",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET?.trim() ?? "",
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET?.trim() ?? "",
    billingPaymentsEnabled: process.env.BILLING_PAYMENTS_ENABLED === "true",
    googleClientId: process.env.GOOGLE_CLIENT_ID?.trim() ?? "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "",
  };
}

export function isRazorpayConfigured() {
  const env = getServerEnv();
  return Boolean(env.razorpayKeyId && env.razorpayKeySecret);
}

export function isBillingCheckoutReady() {
  return getServerEnv().billingPaymentsEnabled && isRazorpayConfigured();
}
