/* ────────────────────────────────────────────────────────────
   CodeStrokeProApp.tsx
   ------------------------------------------------------------------
   Central controller for the CodeStroke Pro workflow
   ──────────────────────────────────────────────────────────── */

"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

/* modular steps */
import LKWTimeEntry from "@/components/calculator/LKWTimeEntry";
import CodeStrokeTimers from "@/components/calculator/CodeStrokeTimers";
import EligibilityScreening from "@/components/calculator/EligibilityScreening";
import DrugSelection from "@/components/calculator/DrugSelection";
import DosingCalculator from "@/components/calculator/DosingCalculator";
import ClinicalResources from "@/components/calculator/ClinicalResources";
import StepProgress from "@/components/calculator/StepProgress";

/* ─────────── types & constants ─────────── */
interface TimerState {
    lkwTime: Date | null;
    arrivalTime: Date | null;
    currentTime: Date;
}
interface EligibilityAnswers {
    underAge: boolean;
    hemorrhage: boolean;
    overTimeLimit: boolean;
    onMedications: boolean;
    contraindications: boolean;
    highBP: boolean;
    abnormalGlucose: boolean;
    rapidImprovement: boolean;
    minorSymptoms: boolean;
    recentSurgery: boolean;
    activeBleed: boolean;
}

const LKW_KEY = "csp-lkw-time";
const ARRIVAL_KEY = "csp-arrival-time";

/* ─────────── component ─────────── */
export default function CodeStrokeProApp() {
    /* ---------------- state ---------------- */
    const [timers, setTimers] = useState<TimerState>({
        lkwTime: null,
        arrivalTime: null,
        currentTime: new Date(),
    });

    const [answers, setAnswers] = useState<EligibilityAnswers>({
        // default → all false
        underAge: false,
        hemorrhage: false,
        overTimeLimit: false,
        onMedications: false,
        contraindications: false,
        highBP: false,
        abnormalGlucose: false,
        rapidImprovement: false,
        minorSymptoms: false,
        recentSurgery: false,
        activeBleed: false,
    });
    const [selectedDrug, setSelectedDrug] = useState<
        "tnk" | "alteplase" | null
    >(null);
    const [vialSize, setVialSize] = useState("");
    const [ptWeight, setPtWeight] = useState("");
    const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
    const [step, setStep] = useState<
        "lkw" | "timers" | "screening" | "drugSelection" | "dosing"
    >("lkw");
    const [showResources, setShowResources] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);

    /* ---------------- clocks ---------------- */
    /* live “now” tick each second */
    useEffect(() => {
        const id = setInterval(
            () => setTimers((p) => ({ ...p, currentTime: new Date() })),
            1_000
        );
        return () => clearInterval(id);
    }, []);

    /* hydrate timers from localStorage once */
    useEffect(() => {
        if (typeof window === "undefined") return;

        const lkwIso = localStorage.getItem(LKW_KEY);
        const arrIso = localStorage.getItem(ARRIVAL_KEY);

        setTimers((p) => ({
            ...p,
            lkwTime: lkwIso ? new Date(lkwIso) : null,
            arrivalTime: arrIso ? new Date(arrIso) : null,
        }));
    }, []);

    /* persist changes */
    useEffect(() => {
        if (typeof window === "undefined") return;

        /* LKW */
        if (timers.lkwTime) {
            localStorage.setItem(LKW_KEY, timers.lkwTime.toISOString());
        } else {
            localStorage.removeItem(LKW_KEY);
        }

        /* Arrival */
        if (timers.arrivalTime) {
            localStorage.setItem(ARRIVAL_KEY, timers.arrivalTime.toISOString());
        } else {
            localStorage.removeItem(ARRIVAL_KEY);
        }
    }, [timers.lkwTime, timers.arrivalTime]);

    /* Scroll to top on step change */
    useEffect(() => {
        if (mainRef.current) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [step]);

    /* ---------------- handlers ---------------- */
    /* from LKW component */
    const handleLKWSet = (d: Date | null) => {
        setTimers((p) => ({
            ...p,
            lkwTime: d,
            arrivalTime: d ? p.arrivalTime : null, // clear door-needle when LKW cleared
        }));
    };

    /* from Door-to-Needle card */
    const handleArrivalStart = (preset?: Date) =>
        setTimers((p) => ({ ...p, arrivalTime: preset ?? new Date() }));

    /* restart everything (resources page) */
    const handleRestartAll = () => {
        localStorage.removeItem(LKW_KEY);
        localStorage.removeItem(ARRIVAL_KEY);
        setTimers({
            lkwTime: null,
            arrivalTime: null,
            currentTime: new Date(),
        });
        setAnswers(
            Object.fromEntries(
                Object.keys(answers).map((k) => [k, false])
            ) as unknown as EligibilityAnswers
        );
        setSelectedDrug(null);
        setVialSize("");
        setPtWeight("");
        setWeightUnit("kg");
        setStep("lkw");
    };

    /* ---------------- header (simple, always visible) ---------------- */
    const HeaderTimer = () =>
        (timers.lkwTime || timers.arrivalTime) && (
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                {/* 4.5-h window */}
                {timers.lkwTime && (
                    <CountdownPill
                        bg="bg-white/15"
                        border="border-white/30"
                        limit={
                            new Date(
                                timers.lkwTime.getTime() + 4.5 * 60 * 60 * 1000
                            )
                        }
                        now={timers.currentTime}
                        label="4.5 h Window"
                        expiredClass="text-critical-crimson"
                        activeClass="text-parchment"
                    />
                )}
                {/* Door-Needle */}
                {timers.arrivalTime && (
                    <ElapsedPill
                        since={timers.arrivalTime}
                        now={timers.currentTime}
                        label="Door-to-Needle"
                    />
                )}
            </div>
        );

    /* ---------------- JSX ---------------- */
    return (
        <div ref={mainRef} className="min-h-screen bg-parchment">
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-50 border-b border-harbor-gray bg-clinical-slate text-parchment/95 backdrop-blur-sm">
                {/* timers */}
                <HeaderTimer />
            </header>

            {/* ================= MAIN ================= */}
            <main className="container mx-auto max-w-6xl px-4 py-6 md:py-8">
                <StepProgress currentStep={step} onStepChange={setStep} />

                {step === "lkw" && (
                    <LKWTimeEntry
                        lkwTime={timers.lkwTime}
                        onTimeSet={handleLKWSet}
                        onNext={() => setStep("timers")}
                    />
                )}

                {step === "timers" && (
                    <CodeStrokeTimers
                        timers={timers}
                        onStartArrivalTimer={handleArrivalStart}
                        onNext={() => setStep("screening")}
                        onBack={() => setStep("lkw")}
                    />
                )}

                {step === "screening" && (
                    <EligibilityScreening
                        answers={answers}
                        onAnswerChange={setAnswers}
                        onNext={() => setStep("drugSelection")}
                        onBack={() => setStep("timers")}
                    />
                )}

                {step === "drugSelection" && (
                    <DrugSelection
                        selectedDrug={selectedDrug}
                        onDrugSelect={setSelectedDrug}
                        onNext={() => setStep("dosing")}
                        onBack={() => setStep("screening")}
                    />
                )}

                {step === "dosing" && selectedDrug && (
                    <DosingCalculator
                        selectedDrug={selectedDrug}
                        patientWeight={ptWeight}
                        weightUnit={weightUnit}
                        vialSize={vialSize}
                        onWeightChange={setPtWeight}
                        onWeightUnitChange={setWeightUnit}
                        onVialSizeChange={setVialSize}
                        onRestart={handleRestartAll}
                        onShowResources={() => setShowResources(true)}
                        onBack={() => setStep("drugSelection")}
                    />
                )}
            </main>

            {/* ================= FLOATING RESOURCES ================= */}
            <div className="fixed bottom-6 right-6 z-40">
                <Dialog open={showResources} onOpenChange={setShowResources}>
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            className="h-14 w-14 rounded-full bg-vital-green p-0 shadow-lg transition hover:bg-vital-green/90"
                            title="Quick resources"
                        >
                            <BookOpen className="h-6 w-6" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[80vw] md:w-[80vw] md:max-w-[80vw] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl text-deep-charcoal">
                                <BookOpen className="h-5 w-5 text-vital-green" />
                                Quick Clinical Resources
                            </DialogTitle>
                        </DialogHeader>
                        <ClinicalResources
                            compact
                            onRestart={handleRestartAll}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

/* ────────── tiny helper sub-components just for the header ────────── */
function CountdownPill({
    limit,
    now,
    label,
    bg,
    border,
    expiredClass,
    activeClass,
}: {
    limit: Date;
    now: Date;
    label: string;
    bg: string;
    border: string;
    expiredClass: string;
    activeClass: string;
}) {
    const diff = limit.getTime() - now.getTime();
    const expired = diff <= 0;
    const h = Math.abs(Math.floor(diff / 3_600_000));
    const m = Math.abs(Math.floor((diff % 3_600_000) / 60_000));
    const s = Math.abs(Math.floor((diff % 60_000) / 1_000));

    return (
        <div
            className={`flex items-center gap-3 rounded-lg ${bg} ${border} px-3 py-1.5`}
        >
            <div className="text-center">
                <div className="text-xs uppercase tracking-wide text-parchment/70">
                    {label}
                </div>
                <div
                    className={`font-mono text-lg font-bold ${
                        expired ? expiredClass : activeClass
                    }`}
                >
                    {expired
                        ? "EXPIRED"
                        : `${h}:${String(m).padStart(2, "0")}:${String(
                              s
                          ).padStart(2, "0")}`}
                </div>
            </div>
        </div>
    );
}

function ElapsedPill({
    since,
    now,
    label,
}: {
    since: Date;
    now: Date;
    label: string;
}) {
    const diff = now.getTime() - since.getTime();
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);

    return (
        <div className="flex items-center gap-3 rounded-lg bg-critical-crimson/20 px-3 py-1.5">
            <div className="text-center">
                <div className="text-xs uppercase tracking-wide text-parchment/70">
                    {label}
                </div>
                <div className="font-mono text-lg font-bold text-parchment">
                    {`${h}:${String(m).padStart(2, "0")}:${String(s).padStart(
                        2,
                        "0"
                    )}`}
                </div>
            </div>
            <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-critical-crimson" />
                <span className="rounded bg-critical-crimson px-2 py-0.5 text-[10px] font-bold leading-none text-white">
                    ACTIVE
                </span>
            </div>
        </div>
    );
}
