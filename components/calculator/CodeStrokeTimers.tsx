/**
 * Author: Abhishek Amgain and Dinesh Chhantyal
 * Version: 1.0.0
 * File Description:
 *     This file defines the CodeStrokeTimers component for the CodeStroke Pro application.
 *     It displays real-time timers for the 4.5-hour thrombolytic window and door-to-needle interval,
 *     providing clinicians with actionable countdowns and elapsed time tracking during acute stroke workflows.
 *     The component supports timer controls, visual status indicators, and navigation for workflow progression.
 */

"use client";

import { useMemo, useState } from "react";
import {
    Clock,
    Timer,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ---------- types ---------- */
interface TimerState {
    lkwTime: Date | null;
    arrivalTime: Date | null;
    currentTime: Date;
}
interface Props {
    timers: TimerState;
    onStartArrivalTimer: (preset?: Date) => void;
    onNext: () => void;
    onBack?: () => void;
}

/* ---------- helpers ---------- */
const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (ms: number) => {
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    const s = Math.floor((ms % 60_000) / 1_000);
    return `${h}h ${pad(m)}m ${pad(s)}s`;
};

/* arrival time presets */
const arrivalPresets = [
    { label: "Now", offset: 0 },
    { label: "5 min ago", offset: 5 },
    { label: "10 min ago", offset: 10 },
    { label: "15 min ago", offset: 15 },
    { label: "30 min ago", offset: 30 },
];

/* time parsing helper */
const fromClock = (timeStr: string, now = new Date()): Date | null => {
    const [h, m] = timeStr.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    // If time is in the future, assume it's from yesterday
    if (d > now) d.setDate(d.getDate() - 1);
    return d;
};

const clampArrivalTime = (d: Date, now = new Date()) => {
    const past24hrs = now.getTime() - 24 * 60 * 60 * 1e3;
    return d.getTime() < past24hrs || d.getTime() > now.getTime() ? null : d;
};

/* ---------- component ---------- */
export default function CodeStrokeTimers({
    timers,
    onStartArrivalTimer,
    onNext,
    onBack,
}: Props) {
    /* ───── state ───── */
    const [showTimeSelection, setShowTimeSelection] = useState(false);
    const [customTime, setCustomTime] = useState("");
    const [isRestarting, setIsRestarting] = useState(false);

    /* ───── derived values ───── */
    const thrombolytic = useMemo(() => {
        if (!timers.lkwTime) return null;
        const limit = new Date(timers.lkwTime.getTime() + 4.5 * 60 * 60 * 1e3);
        const diff = limit.getTime() - timers.currentTime.getTime();
        return { expired: diff <= 0, text: diff <= 0 ? "EXPIRED" : fmt(diff) };
    }, [timers.lkwTime, timers.currentTime]);

    const doorNeedle = useMemo(() => {
        if (!timers.arrivalTime) return null;
        const elapsed = Math.max(
            0,
            timers.currentTime.getTime() - timers.arrivalTime.getTime()
        );
        return fmt(elapsed);
    }, [timers.arrivalTime, timers.currentTime]);

    /* ───── actions ───── */
    const start = () => onStartArrivalTimer(); // now()
    const handleRestartClick = () => {
        setIsRestarting(true);
        setShowTimeSelection(true);
    };

    const cancelRestart = () => {
        setIsRestarting(false);
        setShowTimeSelection(false);
        setCustomTime("");
    };

    /* arrival time selection actions */
    const selectPreset = (offsetMinutes: number) => {
        const arrivalTime = new Date(Date.now() - offsetMinutes * 60_000);
        onStartArrivalTimer(arrivalTime);
        setShowTimeSelection(false);
        setIsRestarting(false);
    };

    const handleCustomTimeSubmit = () => {
        if (!customTime) return;
        const arrivalTime = clampArrivalTime(fromClock(customTime) as Date);
        if (arrivalTime) {
            onStartArrivalTimer(arrivalTime);
            setShowTimeSelection(false);
            setIsRestarting(false);
            setCustomTime("");
        }
    };

    const handleCustomTimeChange = (value: string) => {
        setCustomTime(value);
    };

    const toggleTimeSelection = () => {
        setShowTimeSelection(!showTimeSelection);
        if (!showTimeSelection) {
            setCustomTime("");
        }
    };

    /* ───── UI ───── */
    return (
        <Card className="border border-harbor-gray bg-white shadow-sm">
            {/* ---------- header ---------- */}
            <CardHeader className="rounded-t-lg bg-clinical-slate px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-parchment md:text-xl">
                    <Timer className="h-5 w-5 md:h-6 md:w-6" />
                    Code-Stroke Timers
                </CardTitle>
            </CardHeader>

            {/* ---------- body ---------- */}
            <CardContent className="space-y-6 px-4 py-6 md:px-8 md:py-8">
                {/* inner-grid */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* ===== 4.5-hour window ===== */}
                    <div className="rounded-xl border border-harbor-gray/60 bg-white">
                        <div className="rounded-t-xl bg-clinical-slate/90 px-4 py-2">
                            <h3 className="flex items-center gap-2 text-sm font-medium text-parchment">
                                <Clock className="h-4 w-4" />
                                4.5 hour Thrombolytic Window
                            </h3>
                        </div>
                        <div className="p-4 md:p-6 text-center">
                            {thrombolytic ? (
                                <div
                                    className={`rounded-lg border-2 p-4 md:p-6
                  ${
                      thrombolytic.expired
                          ? "border-critical-crimson/40 bg-critical-crimson/10"
                          : "border-vital-green/30 bg-vital-green/10"
                  }`}
                                >
                                    <p
                                        className={`mb-1 text-xs font-medium tracking-wide
                    ${
                        thrombolytic.expired
                            ? "text-critical-crimson"
                            : "text-vital-green"
                    }`}
                                    >
                                        {thrombolytic.expired
                                            ? "Window Expired"
                                            : "Time Remaining"}
                                    </p>

                                    <p
                                        className={`font-mono font-bold
                    ${
                        thrombolytic.expired
                            ? "text-2xl md:text-4xl text-critical-crimson"
                            : "text-2xl md:text-4xl text-vital-green"
                    }`}
                                    >
                                        {thrombolytic.text}
                                    </p>

                                    {timers.lkwTime && (
                                        <p className="mt-2 text-xs text-deep-charcoal/60">
                                            Last Well Known &nbsp;@
                                            {timers.lkwTime.toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                }
                                            )}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-deep-charcoal/70">
                                    Set Last-Known-Well time first.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ===== Door-to-Needle ===== */}
                    <div className="rounded-xl border border-harbor-gray/60 bg-white">
                        <div className="rounded-t-xl bg-clinical-slate/90 px-4 py-2">
                            <h3 className="flex items-center gap-2 text-sm font-medium text-parchment">
                                <Timer className="h-4 w-4" />
                                Door-to-Needle Timer
                            </h3>
                        </div>
                        <div className="p-4 md:p-6 space-y-4 text-center">
                            {!doorNeedle ? (
                                <>
                                    <p className="text-sm text-deep-charcoal/70">
                                        Tap when patient arrives in the ED
                                    </p>
                                    <Button
                                        size="lg"
                                        onClick={start}
                                        className="w-full rounded-lg bg-critical-crimson py-3 text-base text-parchment hover:bg-critical-crimson/80 md:py-4 md:text-lg"
                                    >
                                        <Timer className="mr-2 h-5 w-5" />
                                        START CODE STROKE
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={toggleTimeSelection}
                                        className="w-full gap-2 rounded-lg text-xs md:text-sm"
                                    >
                                        {showTimeSelection ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                        Set Custom Arrival Time
                                    </Button>

                                    {showTimeSelection && (
                                        <div className="mt-4 p-4 bg-clinical-slate/5 rounded-lg border border-clinical-slate/10 space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-deep-charcoal/80">
                                                    Quick Presets
                                                </p>
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    {arrivalPresets.map(
                                                        ({ label, offset }) => (
                                                            <Button
                                                                key={label}
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    selectPreset(
                                                                        offset
                                                                    )
                                                                }
                                                                className="rounded-full text-xs px-3 py-1.5 border-clinical-slate/30 hover:bg-clinical-slate/10"
                                                            >
                                                                {label}
                                                            </Button>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="custom-arrival-time"
                                                    className="text-xs font-medium text-deep-charcoal/80"
                                                >
                                                    Or Enter Specific Time
                                                </Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="custom-arrival-time"
                                                        type="time"
                                                        step="60"
                                                        value={customTime}
                                                        onChange={(e) =>
                                                            handleCustomTimeChange(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="flex-1 text-center font-mono border-clinical-slate/30 focus:border-harbor-gray"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={
                                                            handleCustomTimeSubmit
                                                        }
                                                        disabled={!customTime}
                                                        className="px-4 bg-clinical-slate text-parchment hover:bg-clinical-slate/90 disabled:opacity-40"
                                                    >
                                                        Set
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : isRestarting ? (
                                <>
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-deep-charcoal/80 mb-2">
                                            Change Arrival Time
                                        </p>
                                        <p className="text-xs text-deep-charcoal/60">
                                            Current:{" "}
                                            {timers.arrivalTime?.toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                }
                                            )}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-clinical-slate/5 rounded-lg border border-clinical-slate/10 space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-deep-charcoal/80">
                                                Quick Presets
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {arrivalPresets.map(
                                                    ({ label, offset }) => (
                                                        <Button
                                                            key={label}
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                selectPreset(
                                                                    offset
                                                                )
                                                            }
                                                            className="rounded-full text-xs px-3 py-1.5 border-clinical-slate/30 hover:bg-clinical-slate/10"
                                                        >
                                                            {label}
                                                        </Button>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="custom-restart-time"
                                                className="text-xs font-medium text-deep-charcoal/80"
                                            >
                                                Or Enter Specific Time
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="custom-restart-time"
                                                    type="time"
                                                    step="60"
                                                    value={customTime}
                                                    onChange={(e) =>
                                                        handleCustomTimeChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 text-center font-mono border-clinical-slate/30 focus:border-harbor-gray"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={
                                                        handleCustomTimeSubmit
                                                    }
                                                    disabled={!customTime}
                                                    className="px-4 bg-clinical-slate text-parchment hover:bg-clinical-slate/90 disabled:opacity-40"
                                                >
                                                    Set
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={cancelRestart}
                                        className="w-full gap-2 rounded-lg text-xs md:text-sm"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="rounded-lg border-2 border-blue-300/50 bg-blue-50 p-4 md:p-6">
                                        <p className="mb-1 text-xs font-medium text-blue-700">
                                            Time Since ED Arrival
                                        </p>
                                        <p className="font-mono text-2xl font-bold text-blue-800 md:text-4xl">
                                            {doorNeedle}
                                        </p>
                                        <Badge className="mt-2 bg-critical-crimson text-[10px] md:text-xs">
                                            CODE STROKE ACTIVE
                                        </Badge>

                                        {timers.arrivalTime && (
                                            <p className="mt-2 text-xs text-blue-700/60">
                                                ED Arrival @{" "}
                                                {timers.arrivalTime.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    }
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRestartClick}
                                        className="w-full gap-2 rounded-lg text-xs md:text-sm"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Change Arrival Time
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== nav buttons ===== */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    {onBack && (
                        <Button
                            variant="outline"
                            onClick={onBack}
                            className="w-full rounded-md px-6 py-3 text-base sm:w-auto sm:text-lg"
                        >
                            Back
                        </Button>
                    )}

                    <Button
                        onClick={onNext}
                        disabled={
                            !doorNeedle || (thrombolytic?.expired ?? true)
                        }
                        className="w-full rounded-md bg-clinical-slate px-6 py-3 text-base text-parchment hover:bg-clinical-slate/90 disabled:opacity-40 sm:w-auto sm:text-lg"
                    >
                        Continue to Eligibility
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
