/**
 * File Description:
 *     Extended-window IV thrombolysis assessment (2026 AHA/ASA AIS guideline).
 *     Shown in eligibility screening when last known well is beyond the
 *     standard 4.5 h window. The clinician picks the time basis (last known
 *     well, symptom onset, or wake-up/unknown onset via midpoint of sleep),
 *     confirms the advanced-imaging findings and other eligibility, and must
 *     sign off before the patient can proceed. The cutoff comes from
 *     lib/clinicalConfig.ts.
 */

"use client";

import { useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    EXTENDED_WINDOW_HOURS,
    IS_GUIDELINE_EXTENDED_WINDOW,
    HOUR_MS,
} from "@/lib/clinicalConfig";

/* ─────────── types & initial state ─────────── */
export type ExtendedBasis = "lkw" | "onset" | "wakeup";

export interface ExtendedWindowState {
    basis: ExtendedBasis | null;
    /** witnessed symptom onset (basis "onset") */
    onsetTime: Date | null;
    /** time the patient woke / symptoms were discovered (basis "wakeup") */
    discoveryTime: Date | null;
    checks: Record<CheckKey, boolean>;
    confirmed: boolean;
}

type CheckKey = "imagingPerformed" | "qualifyingMismatch" | "otherCriteria";

const CHECK_ITEMS: { key: CheckKey; label: string }[] = [
    {
        key: "imagingPerformed",
        label: "Advanced imaging has been performed",
    },
    {
        key: "qualifyingMismatch",
        label: "Advanced imaging demonstrates a qualifying mismatch indicating salvageable brain tissue",
    },
    {
        key: "otherCriteria",
        label: "Patient meets all other eligibility criteria (no contraindications)",
    },
];

export const EXTENDED_INITIAL: ExtendedWindowState = {
    basis: null,
    onsetTime: null,
    discoveryTime: null,
    checks: {
        imagingPerformed: false,
        qualifyingMismatch: false,
        otherCriteria: false,
    },
    confirmed: false,
};

/* ─────────── copy (as provided by the clinical lead) ─────────── */
const cutoff = String(EXTENDED_WINDOW_HOURS);
const TITLE =
    "Extended-Window IV Thrombolysis Eligibility (2026 AHA/ASA Guidelines)";
const BODY = `For selected patients presenting 4.5–${cutoff} hours from last known well, or with wake-up/unknown-onset stroke within ${cutoff} hours of the midpoint of sleep, IV thrombolysis may be considered when advanced imaging demonstrates a qualifying mismatch indicating salvageable brain tissue.`;
const DISCLAIMER =
    "This pathway is intended to support clinical decision-making and does not independently establish treatment eligibility. Confirm applicable time criteria, required imaging findings, contraindications, and all other eligibility requirements in accordance with the current AHA/ASA guidelines and institutional stroke protocol. Final treatment decisions rest with the treating clinician.";
const REFERENCE =
    "2026 AHA/ASA Guideline for the Early Management of Patients With Acute Ischemic Stroke, particularly Section 4.6.3, “Extended Time Windows for Intravenous Thrombolysis.”";

/* ─────────── helpers ─────────── */
function fromClock(t: string, now = new Date()): Date | null {
    const [h, m] = t.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    if (d > now) d.setDate(d.getDate() - 1);
    return d;
}
const toClock = (d: Date | null) =>
    d
        ? d.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
          })
        : "";
const fmtDuration = (ms: number) => {
    const abs = Math.abs(ms);
    return `${Math.floor(abs / HOUR_MS)}h ${Math.floor((abs % HOUR_MS) / 60_000)}m`;
};

/** Pure evaluation of the extended-window pathway against the live clock. */
export function evaluateExtendedWindow(
    v: ExtendedWindowState,
    lkwTime: Date | null,
    now: Date
) {
    let anchor: Date | null = null;
    let midpoint: Date | null = null;
    let error: string | null = null;

    if (v.basis === "lkw") {
        anchor = lkwTime;
    } else if (v.basis === "onset") {
        anchor = v.onsetTime;
        if (anchor && lkwTime && anchor < lkwTime)
            error = "Symptom onset cannot be earlier than last known well.";
    } else if (v.basis === "wakeup" && lkwTime && v.discoveryTime) {
        if (v.discoveryTime < lkwTime) {
            error = "Wake-up / discovery time must be after last known well.";
        } else {
            midpoint = new Date(
                (lkwTime.getTime() + v.discoveryTime.getTime()) / 2
            );
            anchor = midpoint;
        }
    }

    const deadline = anchor
        ? new Date(anchor.getTime() + EXTENDED_WINDOW_HOURS * HOUR_MS)
        : null;
    const timeMet = !!deadline && !error && now <= deadline;
    const checksMet = CHECK_ITEMS.every(({ key }) => v.checks[key]);

    return {
        anchor,
        midpoint,
        deadline,
        error,
        timeMet,
        checksMet,
        complete: timeMet && checksMet && v.confirmed,
    };
}

/* ─────────── component ─────────── */
interface Props {
    value: ExtendedWindowState;
    onChange: (v: ExtendedWindowState) => void;
    lkwTime: Date | null;
    now: Date;
}

const BASES: { value: ExtendedBasis; label: string; hint: string }[] = [
    {
        value: "lkw",
        label: "Last known well",
        hint: `4.5–${cutoff} h from last known well`,
    },
    {
        value: "onset",
        label: "Witnessed symptom onset",
        hint: `4.5–${cutoff} h from symptom onset`,
    },
    {
        value: "wakeup",
        label: "Wake-up / unknown onset",
        hint: `Within ${cutoff} h of the midpoint of sleep`,
    },
];

export default function ExtendedWindowAssessment({
    value,
    onChange,
    lkwTime,
    now,
}: Props) {
    const [onsetClock, setOnsetClock] = useState(toClock(value.onsetTime));
    const [discoveryClock, setDiscoveryClock] = useState(
        toClock(value.discoveryTime)
    );

    const result = evaluateExtendedWindow(value, lkwTime, now);

    /* any edit invalidates a prior clinician confirmation */
    const update = (patch: Partial<ExtendedWindowState>) =>
        onChange({ ...value, ...patch, confirmed: false });

    const anchorLabel =
        value.basis === "wakeup"
            ? "midpoint of sleep"
            : value.basis === "onset"
              ? "symptom onset"
              : "last known well";

    return (
        <div className="rounded-lg border-2 border-urgent-amber/70 bg-urgent-amber/10 p-4 md:p-5 space-y-5">
            {/* header copy */}
            <div className="space-y-2">
                <h4 className="text-base md:text-lg font-semibold text-deep-charcoal">
                    {TITLE}
                </h4>
                <p className="text-sm text-gray-700">{BODY}</p>
                {!IS_GUIDELINE_EXTENDED_WINDOW && (
                    <p className="text-xs font-medium text-gray-600">
                        Institutional protocol cutoff: {cutoff} h (guideline: 9
                        h).
                    </p>
                )}
            </div>

            {/* 1. time basis */}
            <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-800">
                    1. Applicable time criterion
                </p>
                <RadioGroup
                    value={value.basis ?? ""}
                    onValueChange={(b) => update({ basis: b as ExtendedBasis })}
                    className="gap-2"
                >
                    {BASES.map((b) => (
                        <Label
                            key={b.value}
                            htmlFor={`ext-basis-${b.value}`}
                            className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border-2 bg-white p-3 ${
                                value.basis === b.value
                                    ? "border-clinical-slate"
                                    : "border-gray-200"
                            }`}
                        >
                            <RadioGroupItem
                                id={`ext-basis-${b.value}`}
                                value={b.value}
                            />
                            <span className="text-sm">
                                <span className="font-medium">{b.label}</span>
                                <span className="block text-xs text-gray-600">
                                    {b.hint}
                                </span>
                            </span>
                        </Label>
                    ))}
                </RadioGroup>

                {value.basis && (
                    <div className="space-y-3 rounded-lg bg-white p-3 text-sm">
                        <p className="text-gray-700">
                            Last known well (Step 1):{" "}
                            <span className="font-mono font-semibold">
                                {lkwTime
                                    ? lkwTime.toLocaleString([], {
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: false,
                                      })
                                    : "not set"}
                            </span>
                        </p>

                        {value.basis === "onset" && (
                            <div className="flex flex-wrap items-center gap-3">
                                <Label htmlFor="ext-onset">
                                    Symptom onset time
                                </Label>
                                <Input
                                    id="ext-onset"
                                    type="time"
                                    step="60"
                                    value={onsetClock}
                                    onChange={(e) => {
                                        setOnsetClock(e.target.value);
                                        update({
                                            onsetTime: fromClock(e.target.value),
                                        });
                                    }}
                                    className="h-11 w-36 text-center font-mono"
                                />
                            </div>
                        )}

                        {value.basis === "wakeup" && (
                            <>
                                <p className="text-xs text-gray-600">
                                    Last known well should be the latest time
                                    the patient was seen normal before or during
                                    sleep.
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Label htmlFor="ext-discovery">
                                        Woke / symptoms discovered at
                                    </Label>
                                    <Input
                                        id="ext-discovery"
                                        type="time"
                                        step="60"
                                        value={discoveryClock}
                                        onChange={(e) => {
                                            setDiscoveryClock(e.target.value);
                                            update({
                                                discoveryTime: fromClock(
                                                    e.target.value
                                                ),
                                            });
                                        }}
                                        className="h-11 w-36 text-center font-mono"
                                    />
                                </div>
                            </>
                        )}

                        {result.error && (
                            <p className="font-medium text-critical-crimson">
                                {result.error}
                            </p>
                        )}

                        {result.anchor && result.deadline && !result.error && (
                            <div
                                className={`rounded-md px-3 py-2 font-medium ${
                                    result.timeMet
                                        ? "bg-vital-green/20 text-vital-green-dark"
                                        : "bg-critical-crimson/15 text-critical-crimson"
                                }`}
                            >
                                <Clock className="mr-1 inline h-4 w-4" />
                                {result.midpoint &&
                                    `Midpoint of sleep ${toClock(result.midpoint)} · `}
                                {fmtDuration(
                                    now.getTime() - result.anchor.getTime()
                                )}{" "}
                                from {anchorLabel}.{" "}
                                {result.timeMet
                                    ? `Within ${cutoff} h, window closes ${toClock(result.deadline)} (${fmtDuration(result.deadline.getTime() - now.getTime())} left).`
                                    : `Outside the ${cutoff} h extended window.`}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 2. imaging + other criteria */}
            <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                    2. Required imaging findings and other criteria
                </p>
                {CHECK_ITEMS.map((item) => (
                    <div
                        key={item.key}
                        className="flex min-h-[44px] items-start gap-3 rounded-lg border-2 border-gray-200 bg-white p-3"
                    >
                        <Checkbox
                            id={`ext-${item.key}`}
                            checked={value.checks[item.key]}
                            onCheckedChange={(c) =>
                                update({
                                    checks: {
                                        ...value.checks,
                                        [item.key]: c === true,
                                    },
                                })
                            }
                            className="mt-0.5"
                        />
                        <Label
                            htmlFor={`ext-${item.key}`}
                            className="cursor-pointer text-sm leading-relaxed"
                        >
                            {item.label}
                        </Label>
                    </div>
                ))}
            </div>

            {/* caveat */}
            <div className="space-y-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-gray-700">
                <p>
                    <AlertTriangle className="mr-1 inline h-4 w-4 text-urgent-amber-dark" />
                    <strong>Disclaimer:</strong> {DISCLAIMER}
                </p>
                <p>
                    <strong>Reference:</strong> {REFERENCE}
                </p>
            </div>

            {/* 3. clinician confirmation */}
            <div
                className={`flex items-start gap-3 rounded-lg border-2 p-3 ${
                    value.confirmed
                        ? "border-clinical-slate bg-white"
                        : "border-gray-200 bg-white"
                }`}
            >
                <Checkbox
                    id="ext-confirm"
                    checked={value.confirmed}
                    disabled={!result.timeMet || !result.checksMet}
                    onCheckedChange={(c) =>
                        onChange({ ...value, confirmed: c === true })
                    }
                    className="mt-0.5"
                />
                <Label
                    htmlFor="ext-confirm"
                    className="cursor-pointer text-sm font-medium leading-relaxed"
                >
                    I confirm the patient meets the applicable extended time
                    window, has the required advanced imaging findings, and
                    meets all other eligibility criteria per the current AHA/ASA
                    guidelines and institutional stroke protocol.
                    {(!result.timeMet || !result.checksMet) && (
                        <span className="block text-xs font-normal text-gray-500">
                            Available once the time criterion and all items
                            above are met.
                        </span>
                    )}
                </Label>
            </div>
        </div>
    );
}
