import "server-only";

import { Resend } from "resend";

const EMAIL_ADDRESS_PATTERN = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const NAMED_EMAIL_PATTERN = /^[^<>\r\n]+<[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+>$/;

let resendClient;

function createEmailError(code) {
  const error = new Error("The email service could not complete the request.");
  error.code = code;
  return error;
}

function getEmailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    throw createEmailError("missing_resend_configuration");
  }

  if (
    from.includes("\r") ||
    from.includes("\n") ||
    (!EMAIL_ADDRESS_PATTERN.test(from) && !NAMED_EMAIL_PATTERN.test(from))
  ) {
    throw createEmailError("invalid_resend_sender");
  }

  return { apiKey, from };
}

function getResendClient(apiKey) {
  resendClient ??= new Resend(apiKey);
  return resendClient;
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  idempotencyKey,
}) {
  const recipient = typeof to === "string" ? to.trim() : "";

  if (!EMAIL_ADDRESS_PATTERN.test(recipient)) {
    throw createEmailError("invalid_email_recipient");
  }

  if (
    typeof idempotencyKey !== "string" ||
    idempotencyKey.length < 1 ||
    idempotencyKey.length > 256
  ) {
    throw createEmailError("invalid_email_idempotency_key");
  }

  const { apiKey, from } = getEmailConfiguration();
  const { data, error } = await getResendClient(apiKey).emails.send(
    {
      from,
      to: [recipient],
      subject,
      html,
      text,
    },
    { idempotencyKey },
  );

  if (error || !data?.id) {
    throw createEmailError("resend_delivery_failed");
  }

  return data.id;
}
