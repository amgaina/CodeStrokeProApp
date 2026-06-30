"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Reverse proxy: events go through our own domain (rewrites in next.config.mjs)
// so ad/tracking blockers don't drop them. ui_host keeps dashboard links right.
const POSTHOG_PROXY = "/ingest";
const POSTHOG_UI_HOST =
    process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || "https://us.posthog.com";

/**
 * Initializes PostHog and tracks pageviews for the App Router.
 *
 * - Fully de-identified: no patient data is captured.
 * - Captures `utm_*` params automatically, so QR / session-based traffic
 *   sources (e.g. ?utm_source=qr&utm_campaign=spring2026) are attributed.
 * - `capture_pageleave` powers time-on-page / engagement metrics.
 * - Renders children untouched when NEXT_PUBLIC_POSTHOG_KEY is unset.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (!POSTHOG_KEY) return;
        if (posthog.__loaded) return;
        posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_PROXY,
            ui_host: POSTHOG_UI_HOST,
            capture_pageview: false, // handled manually below for SPA nav
            capture_pageleave: true, // engagement / time on page
            autocapture: true,
            persistence: "localStorage+cookie",
        });
    }, []);

    if (!POSTHOG_KEY) return <>{children}</>;

    return (
        <PostHogProvider client={posthog}>
            <Suspense fallback={null}>
                <PageviewTracker />
            </Suspense>
            {children}
        </PostHogProvider>
    );
}

function PageviewTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!pathname || !posthog.__loaded) return;
        let url = window.origin + pathname;
        const qs = searchParams?.toString();
        if (qs) url += `?${qs}`;
        posthog.capture("$pageview", { $current_url: url });
    }, [pathname, searchParams]);

    return null;
}
