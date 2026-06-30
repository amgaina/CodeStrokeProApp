"use client";

import posthog from "posthog-js";

/**
 * Centralized, de-identified usage analytics for CodeStrokePro.
 *
 * Privacy contract:
 *  - NO patient-level data is ever captured. Only aggregate usage patterns
 *    (which tools are opened/completed, PDF downloads, traffic source).
 *  - Numeric clinical scores (e.g. NIHSS total) are non-identifying and are
 *    captured only to describe educational utilization for research.
 *  - Everything is a no-op until NEXT_PUBLIC_POSTHOG_KEY is set, so the app
 *    behaves identically with analytics off.
 */

export const ANALYTICS_ENABLED =
    typeof process !== "undefined" && !!process.env.NEXT_PUBLIC_POSTHOG_KEY;

/** Canonical event names. Keep tool ids stable — manuscripts cite these. */
export const EVENTS = {
    TOOL_VIEWED: "tool_viewed",
    TOOL_COMPLETED: "tool_completed",
    PDF_DOWNLOADED: "pdf_downloaded",
    RESOURCE_OPENED: "resource_opened",
    VIDEO_OPENED: "video_opened",
    // Per-step event for the full calculator workflow, powers a drop-off funnel.
    CALC_STEP: "calculator_step",
} as const;

/** Stable tool identifiers used across all events. */
export type ToolId =
    | "calculator"
    | "fast-calc"
    | "nihss"
    | "cpss"
    | "van"
    | "resources";

/**
 * Fire an aggregate usage event. Safe to call anywhere on the client; it
 * never throws and never blocks the UI, and is a no-op when analytics is off.
 */
export function track(event: string, properties?: Record<string, unknown>) {
    if (!ANALYTICS_ENABLED) return;
    if (typeof window === "undefined") return;
    try {
        posthog.capture(event, properties);
    } catch {
        /* analytics must never break the app */
    }
}

/** A clinical tool produced a result / reached its end state. */
export function trackToolCompleted(
    tool: ToolId,
    properties?: Record<string, unknown>
) {
    track(EVENTS.TOOL_COMPLETED, { tool, ...properties });
}

/** A PDF (dosing card, scale summary, resource doc) was downloaded. */
export function trackPdfDownloaded(
    tool: ToolId,
    properties?: Record<string, unknown>
) {
    track(EVENTS.PDF_DOWNLOADED, { tool, ...properties });
}
