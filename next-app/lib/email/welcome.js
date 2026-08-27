import "server-only";

import { sendTransactionalEmail } from "@/lib/email/resend";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const HOME_URL = "https://sidequest-next-preview.vercel.app/";
const QUIZ_URL = `${HOME_URL}quiz`;
const GUIDE_URL = `${HOME_URL}chat`;
const WELCOME_SUBJECT = "Welcome to SideQuest ✨";

function createWelcomeEmailError(code) {
  const error = new Error("The welcome email could not be completed.");
  error.code = code;
  return error;
}

function normalizeDisplayName(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, 80);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getDisplayName(profile, user) {
  return (
    normalizeDisplayName(profile?.display_name) ||
    normalizeDisplayName(user?.user_metadata?.full_name) ||
    normalizeDisplayName(user?.user_metadata?.name)
  );
}

function createWelcomeEmail(displayName) {
  const greeting = displayName
    ? `Welcome, ${escapeHtml(displayName)}!`
    : "Welcome, adventurer!";
  const textGreeting = displayName
    ? `Welcome, ${displayName}!`
    : "Welcome, adventurer!";

  return {
    subject: WELCOME_SUBJECT,
    html: `
      <!doctype html>
      <html lang="en">
        <body style="margin:0;background:#101b16;color:#f7efd9;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
            <p style="margin:0 0 24px;color:#b8ed7d;font-size:18px;font-weight:700;">SideQuest<span style="color:#ff8357;">.</span></p>
            <div style="border:1px solid #355343;border-radius:24px;background:#17261e;padding:32px;">
              <h1 style="margin:0 0 16px;font-size:30px;line-height:1.2;color:#f7efd9;">${greeting}</h1>
              <p style="margin:0 0 18px;color:#d4d8ce;font-size:16px;line-height:1.65;">
                SideQuest turns an ordinary day into a small, realistic adventure—no huge plan or pressure required.
              </p>
              <p style="margin:0 0 26px;color:#d4d8ce;font-size:16px;line-height:1.65;">
                Generate your first quest whenever you need a playful nudge in a new direction.
              </p>
              <a href="${HOME_URL}" style="display:inline-block;border-radius:999px;background:#b8ed7d;color:#102116;padding:14px 22px;font-size:16px;font-weight:800;text-decoration:none;">
                Generate a SideQuest
              </a>
              <p style="margin:26px 0 0;color:#aebbb2;font-size:14px;line-height:1.6;">
                Looking for something more personal? <a href="${QUIZ_URL}" style="color:#ff9a72;">Take the quest quiz</a>
                or ask the <a href="${GUIDE_URL}" style="color:#ff9a72;">SideQuest Guide</a>.
              </p>
            </div>
            <p style="margin:24px 0 0;color:#8fa096;font-size:13px;line-height:1.5;">Small adventures count.</p>
          </div>
        </body>
      </html>
    `,
    text: `${textGreeting}\n\nSideQuest turns an ordinary day into a small, realistic adventure—no huge plan or pressure required.\n\nGenerate your first quest: ${HOME_URL}\nTake the quest quiz: ${QUIZ_URL}\nAsk the SideQuest Guide: ${GUIDE_URL}\n\nSmall adventures count.`,
  };
}

export async function sendWelcomeEmailIfNeeded(user) {
  if (!user?.id) {
    throw createWelcomeEmailError("missing_authenticated_user");
  }

  if (typeof user.email !== "string" || !user.email.trim()) {
    throw createWelcomeEmailError("missing_authenticated_email");
  }

  const admin = getSupabaseAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("display_name, welcome_email_sent_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    throw createWelcomeEmailError("welcome_profile_lookup_failed");
  }

  if (!profile) {
    throw createWelcomeEmailError("welcome_profile_missing");
  }

  if (profile.welcome_email_sent_at) {
    return { status: "already-sent" };
  }

  const email = createWelcomeEmail(getDisplayName(profile, user));

  await sendTransactionalEmail({
    to: user.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    idempotencyKey: `welcome-user/${user.id}`,
  });

  const { error: markerError } = await admin
    .from("profiles")
    .update({ welcome_email_sent_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("welcome_email_sent_at", null);

  if (markerError) {
    throw createWelcomeEmailError("welcome_marker_update_failed");
  }

  return { status: "sent" };
}

export function reportWelcomeEmailFailure(error) {
  const code =
    typeof error?.code === "string" ? error.code : "unexpected_welcome_error";

  console.error(`[welcome-email] ${code}`);
}
