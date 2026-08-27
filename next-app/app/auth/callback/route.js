import { NextResponse } from "next/server";
import { getSafeReturnPath } from "@/lib/auth-paths";
import {
  reportWelcomeEmailFailure,
  sendWelcomeEmailIfNeeded,
} from "@/lib/email/welcome";
import { createRouteClient } from "@/lib/supabase/server";

function getRedirectOrigin(request, requestUrl) {
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (process.env.NODE_ENV !== "development" && forwardedHost) {
    return `https://${forwardedHost}`;
  }

  const developmentHost = request.headers.get("host");

  if (
    process.env.NODE_ENV === "development" &&
    developmentHost &&
    /^[a-z0-9.-]+(?::\d+)?$/i.test(developmentHost)
  ) {
    return `${requestUrl.protocol}//${developmentHost}`;
  }

  return requestUrl.origin;
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const destination = getSafeReturnPath(
    requestUrl.searchParams.get("next"),
    "/login",
  );

  if (code) {
    const redirectUrl = `${getRedirectOrigin(request, requestUrl)}${destination}`;
    const response = NextResponse.redirect(redirectUrl);
    const supabase = createRouteClient(request, response);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      try {
        await sendWelcomeEmailIfNeeded(data.user || data.session.user);
      } catch (emailError) {
        reportWelcomeEmailFailure(emailError);
      }

      return response;
    }
  }

  const errorUrl = new URL("/login", requestUrl.origin);
  errorUrl.searchParams.set("error", "oauth_callback");
  if (destination !== "/login") {
    errorUrl.searchParams.set("next", destination);
  }
  return NextResponse.redirect(errorUrl);
}
