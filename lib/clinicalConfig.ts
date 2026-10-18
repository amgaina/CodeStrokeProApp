/**
 * Clinical time windows used by the calculator.
 *
 * EXTENDED_WINDOW_HOURS is the extended-window IV thrombolysis cutoff
 * (2026 AHA/ASA AIS guideline: up to 9 h). Set it per deployment with
 * NEXT_PUBLIC_EXTENDED_WINDOW_HOURS to match the approved institutional
 * protocol. Invalid values fall back to 9. Read at build time, so a
 * change needs a redeploy.
 */
export const STANDARD_WINDOW_HOURS = 4.5;

const GUIDELINE_EXTENDED_WINDOW_HOURS = 9;
const configured = Number(process.env.NEXT_PUBLIC_EXTENDED_WINDOW_HOURS);

export const EXTENDED_WINDOW_HOURS =
    Number.isFinite(configured) &&
    configured > STANDARD_WINDOW_HOURS &&
    configured <= 24
        ? configured
        : GUIDELINE_EXTENDED_WINDOW_HOURS;

export const IS_GUIDELINE_EXTENDED_WINDOW =
    EXTENDED_WINDOW_HOURS === GUIDELINE_EXTENDED_WINDOW_HOURS;

export const HOUR_MS = 60 * 60 * 1000;
