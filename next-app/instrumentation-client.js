import * as Sentry from "@sentry/nextjs";
import { getSentryOptions, SENTRY_DSN } from "@/lib/sentry-options";

Sentry.init(getSentryOptions(SENTRY_DSN));
