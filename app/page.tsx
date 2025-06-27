"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Clock,
    Timer,
    Calculator,
    FileText,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Shield,
    Stethoscope,
    Activity,
    Download,
    Eye,
    Users,
    BookOpen,
} from "lucide-react";

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
}

interface DoseCalculation {
    totalDose: number;
    pushDose?: number;
    infusionDose?: number;
    volume: number;
    pushVolume?: number;
    infusionVolume?: number;
    waste: number;
    wasteVolume: number;
}

export default function CodeStrokeProApp() {
    const [timers, setTimers] = useState<TimerState>({
        lkwTime: null,
        arrivalTime: null,
        currentTime: new Date(),
    });

    const [eligibilityAnswers, setEligibilityAnswers] =
        useState<EligibilityAnswers>({
            underAge: false,
            hemorrhage: false,
            overTimeLimit: false,
            onMedications: false,
            contraindications: false,
            highBP: false,
            abnormalGlucose: false,
        });

    const [selectedDrug, setSelectedDrug] = useState<
        "tnk" | "alteplase" | null
    >(null);
    const [vialSize, setVialSize] = useState<string>("");
    const [patientWeight, setPatientWeight] = useState<string>("");
    const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
    const [currentStep, setCurrentStep] = useState<
        | "lkw"
        | "timers"
        | "screening"
        | "drugSelection"
        | "dosing"
        | "resources"
    >("lkw");
    const [medicationsExpanded, setMedicationsExpanded] = useState(false);
    const [contraindicationsExpanded, setContraindicationsExpanded] =
        useState(false);

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prev) => ({ ...prev, currentTime: new Date() }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTimeRemaining = (
        targetTime: Date,
        currentTime: Date
    ): { text: string; isExpired: boolean } => {
        const diff = targetTime.getTime() - currentTime.getTime();
        const isExpired = diff <= 0;

        if (isExpired) {
            const overTime = Math.abs(diff);
            const hours = Math.floor(overTime / (1000 * 60 * 60));
            const minutes = Math.floor(
                (overTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            return {
                text: `EXPIRED by ${hours}h ${minutes}m`,
                isExpired: true,
            };
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { text: `${hours}h ${minutes}m ${seconds}s`, isExpired: false };
    };

    const formatElapsedTime = (startTime: Date, currentTime: Date): string => {
        const diff = currentTime.getTime() - startTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const setLKWTime = (timeInput: string) => {
        const now = new Date();
        const [hours, minutes] = timeInput.split(":").map(Number);
        const lkwDate = new Date();
        lkwDate.setHours(hours, minutes, 0, 0);

        // If the time is in the future, assume it was yesterday
        if (lkwDate > now) {
            lkwDate.setDate(lkwDate.getDate() - 1);
        }

        setTimers((prev) => ({ ...prev, lkwTime: lkwDate }));
    };

    const startArrivalTimer = () => {
        setTimers((prev) => ({ ...prev, arrivalTime: new Date() }));
    };

    const getEligibilityStatus = (): {
        status: "eligible" | "evaluate" | "correct";
        message: string;
    } => {
        const hasAnyYes = Object.values(eligibilityAnswers).some(
            (answer) => answer
        );

        if (!hasAnyYes) {
            return {
                status: "eligible",
                message:
                    "Consider thrombolytic therapy. Patient meets eligibility criteria.",
            };
        }

        if (eligibilityAnswers.highBP || eligibilityAnswers.abnormalGlucose) {
            return {
                status: "correct",
                message:
                    "Correct BP/glucose abnormalities before considering thrombolytic therapy.",
            };
        }

        return {
            status: "evaluate",
            message:
                "Further evaluation needed to discuss risks vs benefits of thrombolytic therapy.",
        };
    };

    const calculateDose = (): DoseCalculation | null => {
        if (!patientWeight || !selectedDrug || !vialSize) return null;

        const weightInKg =
            weightUnit === "lbs"
                ? Number.parseFloat(patientWeight) / 2.2
                : Number.parseFloat(patientWeight);
        const vialSizeNum = Number.parseInt(vialSize);

        if (selectedDrug === "tnk") {
            let dose = 15; // default
            if (weightInKg >= 90) dose = 25;
            else if (weightInKg >= 80) dose = 22.5;
            else if (weightInKg >= 70) dose = 20;
            else if (weightInKg >= 60) dose = 17.5;

            const volume = dose / 5; // 5 mg/mL concentration
            const waste = vialSizeNum - dose;
            const wasteVolume = waste / 5;

            return {
                totalDose: dose,
                volume,
                waste,
                wasteVolume,
            };
        } else {
            // Alteplase
            const totalDose = Math.min(weightInKg * 0.9, 90);
            const pushDose = totalDose * 0.1;
            const infusionDose = totalDose * 0.9;
            const volume = totalDose; // 1 mg/mL concentration
            const pushVolume = pushDose;
            const infusionVolume = infusionDose;
            const waste = vialSizeNum - totalDose;
            const wasteVolume = waste;

            return {
                totalDose,
                pushDose,
                infusionDose,
                volume,
                pushVolume,
                infusionVolume,
                waste,
                wasteVolume,
            };
        }
    };

    const doseCalculation = calculateDose();
    const eligibilityStatus = getEligibilityStatus();

    return (
        <div className="min-h-screen bg-parchment">
            {/* Enhanced Header - Mobile Optimized */}
            <header className="bg-clinical-slate text-parchment clarity-shadow border-b border-harbor-gray">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    {/* Main Header Content */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3 md:space-x-4">
                            <div className="bg-white/10 p-2 md:p-3 rounded-full">
                                <Stethoscope className="w-6 h-6 md:w-8 md:h-8 text-parchment/80" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold tracking-tight text-parchment">
                                    CodeStrokePro
                                </h1>
                                <p className="text-parchment/80 mt-1 text-sm md:text-lg font-medium">
                                    Clinical Decision Support for Acute Stroke
                                    Care
                                </p>
                            </div>
                        </div>
                        <div className="text-center sm:text-right">
                            <div className="bg-white/10 px-3 py-1 md:px-4 md:py-2 rounded-lg">
                                <p className="text-parchment/80 text-xs md:text-sm font-medium">
                                    Funded by
                                </p>
                                <p className="font-semibold text-sm md:text-lg text-parchment">
                                    Living Well Foundation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile-Optimized Timer Display in Header */}
                {(timers.lkwTime || timers.arrivalTime) && (
                    <div className="border-t border-clinical-slate/20 mt-4 md:mt-6 pt-4 md:pt-6">
                        {/* Mobile Layout - Stacked */}
                        <div className="block md:hidden space-y-3">
                            {/* 4.5 Hour Window Timer - Mobile */}
                            {timers.lkwTime && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-blue-200 text-xs font-medium">
                                                4.5 Hour Window
                                            </h3>
                                            <p className="text-blue-100 text-xs">
                                                Time Remaining
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {(() => {
                                                const fourHourLimit = new Date(
                                                    timers.lkwTime.getTime() +
                                                        4.5 * 60 * 60 * 1000
                                                );
                                                const timeRemaining =
                                                    formatTimeRemaining(
                                                        fourHourLimit,
                                                        timers.currentTime
                                                    );
                                                return (
                                                    <>
                                                        <p
                                                            className={`text-lg font-bold ${
                                                                timeRemaining.isExpired
                                                                    ? "text-red-300"
                                                                    : "text-white"
                                                            }`}
                                                        >
                                                            {timeRemaining.text}
                                                        </p>
                                                        <p className="text-blue-200 text-xs">
                                                            LKW:{" "}
                                                            {timers.lkwTime.toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    hour12: true,
                                                                }
                                                            )}
                                                        </p>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Door-to-Needle Timer - Mobile */}
                            {timers.arrivalTime && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-blue-200 text-xs font-medium">
                                                Door-to-Needle
                                            </h3>
                                            <p className="text-blue-100 text-xs">
                                                Time Since Arrival
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-lg font-bold">
                                                {formatElapsedTime(
                                                    timers.arrivalTime,
                                                    timers.currentTime
                                                )}
                                            </p>
                                            <div className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                                CODE STROKE
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Desktop Layout - Side by Side */}
                        <div className="hidden md:grid md:grid-cols-2 gap-6">
                            {/* 4.5 Hour Window Timer - Desktop */}
                            {timers.lkwTime && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <div className="text-center">
                                        <h3 className="text-blue-200 text-sm font-medium mb-1">
                                            4.5 Hour Window
                                        </h3>
                                        <p className="text-blue-100 text-xs mb-2">
                                            Time Remaining for Thrombolytics
                                        </p>
                                        {(() => {
                                            const fourHourLimit = new Date(
                                                timers.lkwTime.getTime() +
                                                    4.5 * 60 * 60 * 1000
                                            );
                                            const timeRemaining =
                                                formatTimeRemaining(
                                                    fourHourLimit,
                                                    timers.currentTime
                                                );
                                            return (
                                                <>
                                                    <p
                                                        className={`text-2xl font-bold mb-1 ${
                                                            timeRemaining.isExpired
                                                                ? "text-red-300"
                                                                : "text-white"
                                                        }`}
                                                    >
                                                        {timeRemaining.text}
                                                    </p>
                                                    <p className="text-blue-200 text-xs">
                                                        LKW:{" "}
                                                        {timers.lkwTime.toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            }
                                                        )}
                                                    </p>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}

                            {/* Door-to-Needle Timer - Desktop */}
                            {timers.arrivalTime && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <div className="text-center">
                                        <h3 className="text-blue-200 text-sm font-medium mb-1">
                                            Door-to-Needle Timer
                                        </h3>
                                        <p className="text-blue-100 text-xs mb-2">
                                            Time Since ED Arrival
                                        </p>
                                        <p className="text-white text-2xl font-bold mb-1">
                                            {formatElapsedTime(
                                                timers.arrivalTime,
                                                timers.currentTime
                                            )}
                                        </p>
                                        <div className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            CODE STROKE ACTIVE
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
                {/* Mobile-Optimized Progress Indicator */}
                <div className="mb-6 md:mb-8">
                    <div className="bg-white rounded-xl clarity-shadow p-4 md:p-6 border border-harbor-gray">
                        {/* Mobile Progress - Horizontal Scroll */}
                        <div className="block md:hidden">
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                {[
                                    { key: "lkw", label: "LKW", icon: Clock },
                                    {
                                        key: "timers",
                                        label: "Timer",
                                        icon: Timer,
                                    },
                                    {
                                        key: "screening",
                                        label: "Screen",
                                        icon: Shield,
                                    },
                                    {
                                        key: "drugSelection",
                                        label: "Drug",
                                        icon: Activity,
                                    },
                                    {
                                        key: "dosing",
                                        label: "Dose",
                                        icon: Calculator,
                                    },
                                    {
                                        key: "resources",
                                        label: "Resources",
                                        icon: BookOpen,
                                    },
                                ].map((step, index) => {
                                    const isActive = currentStep === step.key;
                                    const isCompleted =
                                        [
                                            "lkw",
                                            "timers",
                                            "screening",
                                            "drugSelection",
                                            "dosing",
                                            "resources",
                                        ].indexOf(currentStep) > index;
                                    const IconComponent = step.icon;

                                    return (
                                        <div
                                            key={step.key}
                                            className="flex flex-col items-center min-w-0 flex-shrink-0"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                                                    isActive
                                                        ? "bg-clinical-slate text-parchment clarity-shadow scale-110"
                                                        : isCompleted
                                                        ? "bg-vital-green text-parchment"
                                                        : "bg-harbor-gray text-deep-charcoal"
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <IconComponent className="w-4 h-4" />
                                                )}
                                            </div>
                                            <span
                                                className={`mt-1 text-xs font-medium text-center ${
                                                    isActive
                                                        ? "text-clinical-slate"
                                                        : "text-deep-charcoal"
                                                }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Desktop Progress - Full Width */}
                        <div className="hidden md:flex items-center justify-between">
                            {[
                                { key: "lkw", label: "LKW Time", icon: Clock },
                                {
                                    key: "timers",
                                    label: "Code Timer",
                                    icon: Timer,
                                },
                                {
                                    key: "screening",
                                    label: "Screening",
                                    icon: Shield,
                                },
                                {
                                    key: "drugSelection",
                                    label: "Drug Selection",
                                    icon: Activity,
                                },
                                {
                                    key: "dosing",
                                    label: "Dosing",
                                    icon: Calculator,
                                },
                                {
                                    key: "resources",
                                    label: "Resources",
                                    icon: BookOpen,
                                },
                            ].map((step, index) => {
                                const isActive = currentStep === step.key;
                                const isCompleted =
                                    [
                                        "lkw",
                                        "timers",
                                        "screening",
                                        "drugSelection",
                                        "dosing",
                                        "resources",
                                    ].indexOf(currentStep) > index;
                                const IconComponent = step.icon;

                                return (
                                    <div
                                        key={step.key}
                                        className="flex items-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                                                    isActive
                                                        ? "bg-clinical-slate text-parchment clarity-shadow scale-110"
                                                        : isCompleted
                                                        ? "bg-vital-green text-parchment"
                                                        : "bg-harbor-gray text-deep-charcoal"
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <IconComponent className="w-5 h-5" />
                                                )}
                                            </div>
                                            <span
                                                className={`mt-2 text-xs font-medium ${
                                                    isActive
                                                        ? "text-clinical-slate"
                                                        : "text-deep-charcoal"
                                                }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        {index < 5 && (
                                            <div className="w-12 h-0.5 bg-harbor-gray mx-2" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Step 1: LKW Time Entry - Mobile Optimized */}
                {currentStep === "lkw" && (
                    <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
                        <CardHeader className="bg-clinical-slate text-parchment rounded-t-lg p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                                <Clock className="w-5 h-5 md:w-6 md:h-6" />
                                Last Known Well Time Entry
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8">
                            <div className="max-w-md mx-auto space-y-4 md:space-y-6">
                                <div className="text-center">
                                    <h3 className="text-base md:text-lg font-semibold text-deep-charcoal mb-2">
                                        When was the patient last seen normal?
                                    </h3>
                                    <p className="text-deep-charcoal/70 text-sm">
                                        Enter the time based on your current
                                        local time zone
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-center">
                                        <Label
                                            htmlFor="lkw-time"
                                            className="text-sm md:text-base font-medium text-deep-charcoal block mb-2"
                                        >
                                            Last Known Well Time
                                        </Label>
                                        <div className="flex justify-center">
                                            <Input
                                                id="lkw-time"
                                                type="time"
                                                onChange={(e) =>
                                                    setLKWTime(e.target.value)
                                                }
                                                className="w-auto text-center text-base md:text-lg p-3 md:p-4 border-2 border-harbor-gray focus:border-clinical-slate rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {timers.lkwTime && (
                                        <div className="text-center p-3 md:p-4 bg-vital-green/10 border-2 border-vital-green/30 rounded-lg clarity-shadow">
                                            <p className="text-sm text-vital-green mb-1">
                                                LKW Time Set
                                            </p>
                                            <p className="text-base md:text-lg font-semibold text-deep-charcoal">
                                                {timers.lkwTime.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        onClick={() => setCurrentStep("timers")}
                                        className="bg-clinical-slate hover:bg-clinical-slate/90 text-parchment btn-text text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                                        disabled={!timers.lkwTime}
                                    >
                                        Continue to Code Stroke Timer
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Code Stroke Timer - Mobile Optimized */}
                {currentStep === "timers" && (
                    <div className="space-y-4 md:space-y-6">
                        {/* Warning Banner */}
                        <Alert className="border-urgent-amber/30 bg-urgent-amber/10 clarity-shadow">
                            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-urgent-amber" />
                            <AlertDescription className="text-deep-charcoal font-medium text-sm md:text-base">
                                <strong className="text-urgent-amber">
                                    Important:
                                </strong>{" "}
                                Do not close this application. Timers will reset
                                if the page is closed.
                            </AlertDescription>
                        </Alert>

                        {/* Mobile Layout - Stacked */}
                        <div className="block lg:hidden space-y-4">
                            {/* LKW Countdown - Mobile */}
                            <Card className="shadow-xl border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Clock className="w-4 h-4" />
                                        4.5 Hour Window
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {timers.lkwTime && (
                                        <div className="text-center">
                                            {(() => {
                                                const fourHourLimit = new Date(
                                                    timers.lkwTime.getTime() +
                                                        4.5 * 60 * 60 * 1000
                                                );
                                                const timeRemaining =
                                                    formatTimeRemaining(
                                                        fourHourLimit,
                                                        timers.currentTime
                                                    );
                                                return (
                                                    <div
                                                        className={`p-4 rounded-xl ${
                                                            timeRemaining.isExpired
                                                                ? "bg-red-50 border-2 border-red-200"
                                                                : "bg-green-50 border-2 border-green-200"
                                                        }`}
                                                    >
                                                        <p
                                                            className={`text-xs mb-2 ${
                                                                timeRemaining.isExpired
                                                                    ? "text-red-700"
                                                                    : "text-green-700"
                                                            }`}
                                                        >
                                                            Time Remaining for
                                                            Thrombolytics
                                                        </p>
                                                        <p
                                                            className={`text-2xl md:text-4xl font-bold ${
                                                                timeRemaining.isExpired
                                                                    ? "text-red-800"
                                                                    : "text-green-800"
                                                            }`}
                                                        >
                                                            {timeRemaining.text}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-2">
                                                            LKW:{" "}
                                                            {timers.lkwTime.toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Code Stroke Timer - Mobile */}
                            <Card className="shadow-xl border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Timer className="w-4 h-4" />
                                        Door-to-Needle Timer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {!timers.arrivalTime ? (
                                        <div className="text-center space-y-4">
                                            <p className="text-gray-600 text-sm">
                                                Start timer when patient arrives
                                                to ED
                                            </p>
                                            <Button
                                                onClick={startArrivalTimer}
                                                className="w-full bg-red-600 hover:bg-red-700 text-base md:text-lg py-3 md:py-4"
                                                size="lg"
                                            >
                                                <Timer className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                                START CODE STROKE
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                            <p className="text-xs text-blue-700 mb-2">
                                                Time Since ED Arrival
                                            </p>
                                            <p className="text-2xl md:text-4xl font-bold text-blue-800">
                                                {formatElapsedTime(
                                                    timers.arrivalTime,
                                                    timers.currentTime
                                                )}
                                            </p>
                                            <Badge className="mt-2 bg-red-600 text-xs">
                                                CODE STROKE ACTIVE
                                            </Badge>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Desktop Layout - Side by Side */}
                        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
                            {/* LKW Countdown - Desktop */}
                            <Card className="shadow-xl border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        4.5 Hour Window
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {timers.lkwTime && (
                                        <div className="text-center">
                                            {(() => {
                                                const fourHourLimit = new Date(
                                                    timers.lkwTime.getTime() +
                                                        4.5 * 60 * 60 * 1000
                                                );
                                                const timeRemaining =
                                                    formatTimeRemaining(
                                                        fourHourLimit,
                                                        timers.currentTime
                                                    );
                                                return (
                                                    <div
                                                        className={`p-6 rounded-xl ${
                                                            timeRemaining.isExpired
                                                                ? "bg-red-50 border-2 border-red-200"
                                                                : "bg-green-50 border-2 border-green-200"
                                                        }`}
                                                    >
                                                        <p
                                                            className={`text-sm mb-2 ${
                                                                timeRemaining.isExpired
                                                                    ? "text-red-700"
                                                                    : "text-green-700"
                                                            }`}
                                                        >
                                                            Time Remaining for
                                                            Thrombolytics
                                                        </p>
                                                        <p
                                                            className={`text-4xl font-bold ${
                                                                timeRemaining.isExpired
                                                                    ? "text-red-800"
                                                                    : "text-green-800"
                                                            }`}
                                                        >
                                                            {timeRemaining.text}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-2">
                                                            LKW:{" "}
                                                            {timers.lkwTime.toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Code Stroke Timer - Desktop */}
                            <Card className="shadow-xl border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Timer className="w-5 h-5" />
                                        Door-to-Needle Timer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {!timers.arrivalTime ? (
                                        <div className="text-center space-y-4">
                                            <p className="text-gray-600">
                                                Start timer when patient arrives
                                                to ED
                                            </p>
                                            <Button
                                                onClick={startArrivalTimer}
                                                className="w-full bg-red-600 hover:bg-red-700 text-lg py-4"
                                                size="lg"
                                            >
                                                <Timer className="w-5 h-5 mr-2" />
                                                START CODE STROKE
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                            <p className="text-sm text-blue-700 mb-2">
                                                Time Since ED Arrival
                                            </p>
                                            <p className="text-4xl font-bold text-blue-800">
                                                {formatElapsedTime(
                                                    timers.arrivalTime,
                                                    timers.currentTime
                                                )}
                                            </p>
                                            <Badge className="mt-2 bg-red-600">
                                                CODE STROKE ACTIVE
                                            </Badge>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={() => setCurrentStep("screening")}
                                className="bg-blue-600 hover:bg-blue-700 text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                                disabled={!timers.arrivalTime}
                            >
                                Continue to Eligibility Screening
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Enhanced Eligibility Screening - Mobile Optimized */}
                {currentStep === "screening" && (
                    <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
                        <CardHeader className="bg-clinical-slate text-parchment p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                                <Shield className="w-5 h-5 md:w-6 md:h-6" />
                                Thrombolytic Eligibility Screening
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                            <div className="space-y-4 md:space-y-6">
                                {/* Basic Criteria */}
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                                        Basic Criteria
                                    </h3>

                                    {[
                                        {
                                            key: "underAge",
                                            label: "Is the patient <18 years of age?",
                                        },
                                        {
                                            key: "hemorrhage",
                                            label: "Did head CT suggest or confirm any hemorrhage?",
                                        },
                                        {
                                            key: "overTimeLimit",
                                            label: "Is the patient's last known well more than 4.5 hours ago?",
                                        },
                                    ].map((question) => (
                                        <div
                                            key={question.key}
                                            className="flex items-start space-x-3 p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                                        >
                                            <Checkbox
                                                id={question.key}
                                                checked={
                                                    eligibilityAnswers[
                                                        question.key as keyof EligibilityAnswers
                                                    ]
                                                }
                                                onCheckedChange={(checked) =>
                                                    setEligibilityAnswers(
                                                        (prev) => ({
                                                            ...prev,
                                                            [question.key]:
                                                                checked ===
                                                                true,
                                                        })
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <Label
                                                htmlFor={question.key}
                                                className="text-sm leading-relaxed cursor-pointer font-medium"
                                            >
                                                {question.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>

                                {/* Medications Section - Mobile Optimized */}
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                                        Current Medications
                                    </h3>

                                    <div className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                        <div className="flex items-start space-x-3">
                                            <Checkbox
                                                id="onMedications"
                                                checked={
                                                    eligibilityAnswers.onMedications
                                                }
                                                onCheckedChange={(checked) =>
                                                    setEligibilityAnswers(
                                                        (prev) => ({
                                                            ...prev,
                                                            onMedications:
                                                                checked ===
                                                                true,
                                                        })
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <Label
                                                    htmlFor="onMedications"
                                                    className="text-sm font-medium cursor-pointer"
                                                >
                                                    Is the patient currently
                                                    taking any of the following
                                                    medications?
                                                </Label>

                                                <Collapsible
                                                    open={medicationsExpanded}
                                                    onOpenChange={
                                                        setMedicationsExpanded
                                                    }
                                                >
                                                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                        {medicationsExpanded ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                        View Medication List
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="mt-4 space-y-4">
                                                        {/* Mobile Layout - Stacked */}
                                                        <div className="block md:hidden space-y-4">
                                                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                                                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2 text-sm">
                                                                    <AlertTriangle className="w-3 h-3" />
                                                                    Anticoagulants
                                                                    (High Risk)
                                                                </h4>
                                                                <div className="space-y-2 text-xs">
                                                                    <div>
                                                                        <p className="font-medium text-red-700">
                                                                            Oral
                                                                            Anticoagulants:
                                                                        </p>
                                                                        <ul className="list-disc list-inside text-red-600 ml-2 space-y-1">
                                                                            <li>
                                                                                Warfarin
                                                                                (Coumadin)
                                                                            </li>
                                                                            <li>
                                                                                Apixaban
                                                                                (Eliquis)
                                                                            </li>
                                                                            <li>
                                                                                Rivaroxaban
                                                                                (Xarelto)
                                                                            </li>
                                                                            <li>
                                                                                Dabigatran
                                                                                (Pradaxa)
                                                                            </li>
                                                                            <li>
                                                                                Edoxaban
                                                                                (Savaysa)
                                                                            </li>
                                                                            <li>
                                                                                Betrixaban
                                                                                (Bevyxxa)
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-red-700">
                                                                            Injectable
                                                                            Anticoagulants:
                                                                        </p>
                                                                        <ul className="list-disc list-inside text-red-600 ml-2 space-y-1">
                                                                            <li>
                                                                                Enoxaparin
                                                                                (Lovenox)
                                                                            </li>
                                                                            <li>
                                                                                Dalteparin
                                                                                (Fragmin)
                                                                            </li>
                                                                            <li>
                                                                                Fondaparinux
                                                                                (Arixtra)
                                                                            </li>
                                                                            <li>
                                                                                Heparin
                                                                                (unfractionated)
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                                <h4 className="font-semibold text-yellow-800 mb-2 text-sm">
                                                                    Antiplatelet
                                                                    Agents
                                                                </h4>
                                                                <p className="text-xs text-yellow-700 mb-2">
                                                                    Not absolute
                                                                    contraindications
                                                                    but
                                                                    clinically
                                                                    relevant
                                                                </p>
                                                                <ul className="list-disc list-inside text-yellow-600 text-xs space-y-1">
                                                                    <li>
                                                                        Aspirin
                                                                    </li>
                                                                    <li>
                                                                        Clopidogrel
                                                                        (Plavix)
                                                                    </li>
                                                                    <li>
                                                                        Ticagrelor
                                                                        (Brilinta)
                                                                    </li>
                                                                    <li>
                                                                        Prasugrel
                                                                        (Effient)
                                                                    </li>
                                                                    <li>
                                                                        Dipyridamole/Aspirin
                                                                    </li>
                                                                    <li>
                                                                        Cangrelor
                                                                    </li>
                                                                    <li>
                                                                        Ticlopidine
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {/* Desktop Layout - Side by Side */}
                                                        <div className="hidden md:grid md:grid-cols-2 gap-4">
                                                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                                                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                                                    <AlertTriangle className="w-4 h-4" />
                                                                    Anticoagulants
                                                                    (High Risk)
                                                                </h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div>
                                                                        <p className="font-medium text-red-700">
                                                                            Oral
                                                                            Anticoagulants:
                                                                        </p>
                                                                        <ul className="list-disc list-inside text-red-600 ml-2 space-y-1">
                                                                            <li>
                                                                                Warfarin
                                                                                (Coumadin)
                                                                            </li>
                                                                            <li>
                                                                                Apixaban
                                                                                (Eliquis)
                                                                            </li>
                                                                            <li>
                                                                                Rivaroxaban
                                                                                (Xarelto)
                                                                            </li>
                                                                            <li>
                                                                                Dabigatran
                                                                                (Pradaxa)
                                                                            </li>
                                                                            <li>
                                                                                Edoxaban
                                                                                (Savaysa)
                                                                            </li>
                                                                            <li>
                                                                                Betrixaban
                                                                                (Bevyxxa)
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-red-700">
                                                                            Injectable
                                                                            Anticoagulants:
                                                                        </p>
                                                                        <ul className="list-disc list-inside text-red-600 ml-2 space-y-1">
                                                                            <li>
                                                                                Enoxaparin
                                                                                (Lovenox)
                                                                            </li>
                                                                            <li>
                                                                                Dalteparin
                                                                                (Fragmin)
                                                                            </li>
                                                                            <li>
                                                                                Fondaparinux
                                                                                (Arixtra)
                                                                            </li>
                                                                            <li>
                                                                                Heparin
                                                                                (unfractionated)
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                                                <h4 className="font-semibold text-yellow-800 mb-3">
                                                                    Antiplatelet
                                                                    Agents
                                                                </h4>
                                                                <p className="text-xs text-yellow-700 mb-2">
                                                                    Not absolute
                                                                    contraindications
                                                                    but
                                                                    clinically
                                                                    relevant
                                                                </p>
                                                                <ul className="list-disc list-inside text-yellow-600 text-sm space-y-1">
                                                                    <li>
                                                                        Aspirin
                                                                    </li>
                                                                    <li>
                                                                        Clopidogrel
                                                                        (Plavix)
                                                                    </li>
                                                                    <li>
                                                                        Ticagrelor
                                                                        (Brilinta)
                                                                    </li>
                                                                    <li>
                                                                        Prasugrel
                                                                        (Effient)
                                                                    </li>
                                                                    <li>
                                                                        Dipyridamole/Aspirin
                                                                    </li>
                                                                    <li>
                                                                        Cangrelor
                                                                    </li>
                                                                    <li>
                                                                        Ticlopidine
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <Alert className="border-blue-200 bg-blue-50">
                                                            <AlertTriangle className="h-4 w-4 text-blue-600" />
                                                            <AlertDescription className="text-blue-800 text-xs md:text-sm">
                                                                <strong>
                                                                    Clinical
                                                                    Note:
                                                                </strong>{" "}
                                                                Patients taking
                                                                anticoagulants
                                                                may require
                                                                additional labs
                                                                (INR, aPTT,
                                                                anti-Xa levels)
                                                                and physician
                                                                consultation
                                                                before
                                                                proceeding.
                                                            </AlertDescription>
                                                        </Alert>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contraindications Section - Mobile Optimized */}
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                                        Clinical Contraindications
                                    </h3>

                                    <div className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                        <div className="flex items-start space-x-3">
                                            <Checkbox
                                                id="contraindications"
                                                checked={
                                                    eligibilityAnswers.contraindications
                                                }
                                                onCheckedChange={(checked) =>
                                                    setEligibilityAnswers(
                                                        (prev) => ({
                                                            ...prev,
                                                            contraindications:
                                                                checked ===
                                                                true,
                                                        })
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <Label
                                                    htmlFor="contraindications"
                                                    className="text-sm font-medium cursor-pointer"
                                                >
                                                    Are there any known
                                                    contraindications to
                                                    receiving a thrombolytic?
                                                </Label>

                                                <Collapsible
                                                    open={
                                                        contraindicationsExpanded
                                                    }
                                                    onOpenChange={
                                                        setContraindicationsExpanded
                                                    }
                                                >
                                                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                        {contraindicationsExpanded ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                        View Contraindications
                                                        List
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="mt-4">
                                                        {/* Mobile Layout - Stacked */}
                                                        <div className="block md:hidden space-y-3 text-xs">
                                                            <div className="bg-red-50 p-3 rounded border border-red-200">
                                                                <h5 className="font-semibold text-red-800 text-sm">
                                                                    Hemorrhage
                                                                    Risk
                                                                </h5>
                                                                <ul className="list-disc list-inside text-red-600 mt-1 space-y-1">
                                                                    <li>
                                                                        Active
                                                                        internal
                                                                        bleeding
                                                                    </li>
                                                                    <li>
                                                                        Recent
                                                                        intracranial/spinal
                                                                        surgery
                                                                        (&lt;3
                                                                        months)
                                                                    </li>
                                                                    <li>
                                                                        Serious
                                                                        head
                                                                        trauma
                                                                        (&lt;3
                                                                        months)
                                                                    </li>
                                                                    <li>
                                                                        Previous
                                                                        stroke
                                                                        (&lt;3
                                                                        months)
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            <div className="bg-orange-50 p-3 rounded border border-orange-200">
                                                                <h5 className="font-semibold text-orange-800 text-sm">
                                                                    Coagulopathy
                                                                </h5>
                                                                <ul className="list-disc list-inside text-orange-600 mt-1 space-y-1">
                                                                    <li>
                                                                        Platelets
                                                                        &lt;100,000
                                                                    </li>
                                                                    <li>
                                                                        INR
                                                                        &gt;1.7
                                                                        or PT
                                                                        &gt;15
                                                                        sec
                                                                    </li>
                                                                    <li>
                                                                        aPTT
                                                                        &gt;40
                                                                        sec
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                                                                <h5 className="font-semibold text-yellow-800 text-sm">
                                                                    Vascular
                                                                </h5>
                                                                <ul className="list-disc list-inside text-yellow-600 mt-1 space-y-1">
                                                                    <li>
                                                                        Known
                                                                        AVM or
                                                                        aneurysm
                                                                    </li>
                                                                    <li>
                                                                        Neoplasm
                                                                        with
                                                                        high
                                                                        bleeding
                                                                        risk
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                                                <h5 className="font-semibold text-gray-800 text-sm">
                                                                    Other
                                                                </h5>
                                                                <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1">
                                                                    <li>
                                                                        Symptoms
                                                                        resolving
                                                                        rapidly
                                                                    </li>
                                                                    <li>
                                                                        Seizure
                                                                        at
                                                                        stroke
                                                                        onset
                                                                    </li>
                                                                    <li>
                                                                        Recent
                                                                        GI/GU
                                                                        hemorrhage
                                                                        (&lt;21
                                                                        days)
                                                                    </li>
                                                                    <li>
                                                                        Infective
                                                                        endocarditis
                                                                    </li>
                                                                    <li>
                                                                        Suspected
                                                                        aortic
                                                                        dissection
                                                                    </li>
                                                                    <li>
                                                                        Pregnancy
                                                                        (relative)
                                                                    </li>
                                                                    <li>
                                                                        Age
                                                                        &gt;80
                                                                        years
                                                                        (weigh
                                                                        risks)
                                                                    </li>
                                                                    <li>
                                                                        NIHSS
                                                                        &gt;25
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {/* Desktop Layout - Grid */}
                                                        <div className="hidden md:grid md:grid-cols-2 gap-4 text-sm">
                                                            <div className="space-y-3">
                                                                <div className="bg-red-50 p-3 rounded border border-red-200">
                                                                    <h5 className="font-semibold text-red-800">
                                                                        Hemorrhage
                                                                        Risk
                                                                    </h5>
                                                                    <ul className="list-disc list-inside text-red-600 mt-1 space-y-1">
                                                                        <li>
                                                                            Active
                                                                            internal
                                                                            bleeding
                                                                        </li>
                                                                        <li>
                                                                            Recent
                                                                            intracranial/spinal
                                                                            surgery
                                                                            (&lt;3
                                                                            months)
                                                                        </li>
                                                                        <li>
                                                                            Serious
                                                                            head
                                                                            trauma
                                                                            (&lt;3
                                                                            months)
                                                                        </li>
                                                                        <li>
                                                                            Previous
                                                                            stroke
                                                                            (&lt;3
                                                                            months)
                                                                        </li>
                                                                    </ul>
                                                                </div>

                                                                <div className="bg-orange-50 p-3 rounded border border-orange-200">
                                                                    <h5 className="font-semibold text-orange-800">
                                                                        Coagulopathy
                                                                    </h5>
                                                                    <ul className="list-disc list-inside text-orange-600 mt-1 space-y-1">
                                                                        <li>
                                                                            Platelets
                                                                            &lt;100,000
                                                                        </li>
                                                                        <li>
                                                                            INR
                                                                            &gt;1.7
                                                                            or
                                                                            PT
                                                                            &gt;15
                                                                            sec
                                                                        </li>
                                                                        <li>
                                                                            aPTT
                                                                            &gt;40
                                                                            sec
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                                                                    <h5 className="font-semibold text-yellow-800">
                                                                        Vascular
                                                                    </h5>
                                                                    <ul className="list-disc list-inside text-yellow-600 mt-1 space-y-1">
                                                                        <li>
                                                                            Known
                                                                            AVM
                                                                            or
                                                                            aneurysm
                                                                        </li>
                                                                        <li>
                                                                            Neoplasm
                                                                            with
                                                                            high
                                                                            bleeding
                                                                            risk
                                                                        </li>
                                                                    </ul>
                                                                </div>

                                                                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                                                    <h5 className="font-semibold text-gray-800">
                                                                        Other
                                                                    </h5>
                                                                    <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1">
                                                                        <li>
                                                                            Symptoms
                                                                            resolving
                                                                            rapidly
                                                                        </li>
                                                                        <li>
                                                                            Seizure
                                                                            at
                                                                            stroke
                                                                            onset
                                                                        </li>
                                                                        <li>
                                                                            Recent
                                                                            GI/GU
                                                                            hemorrhage
                                                                            (&lt;21
                                                                            days)
                                                                        </li>
                                                                        <li>
                                                                            Infective
                                                                            endocarditis
                                                                        </li>
                                                                        <li>
                                                                            Suspected
                                                                            aortic
                                                                            dissection
                                                                        </li>
                                                                        <li>
                                                                            Pregnancy
                                                                            (relative)
                                                                        </li>
                                                                        <li>
                                                                            Age
                                                                            &gt;80
                                                                            years
                                                                            (weigh
                                                                            risks)
                                                                        </li>
                                                                        <li>
                                                                            NIHSS
                                                                            &gt;25
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vital Signs - Mobile Optimized */}
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                                        Vital Signs & Labs
                                    </h3>

                                    {/* Mobile Layout - Stacked */}
                                    <div className="block md:hidden space-y-3">
                                        <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    id="highBP"
                                                    checked={
                                                        eligibilityAnswers.highBP
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        setEligibilityAnswers(
                                                            (prev) => ({
                                                                ...prev,
                                                                highBP:
                                                                    checked ===
                                                                    true,
                                                            })
                                                        )
                                                    }
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor="highBP"
                                                    className="text-sm leading-relaxed cursor-pointer font-medium"
                                                >
                                                    Is BP &gt;185/110?
                                                </Label>
                                            </div>

                                            {eligibilityAnswers.highBP && (
                                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Download className="w-3 h-3 text-red-600" />
                                                        <span className="text-xs font-medium text-red-800">
                                                            BP Management
                                                            Required
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-700 border-red-300 hover:bg-red-50 text-xs"
                                                    >
                                                        <FileText className="w-3 h-3 mr-1" />
                                                        Download
                                                        Antihypertensives Guide
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    id="abnormalGlucose"
                                                    checked={
                                                        eligibilityAnswers.abnormalGlucose
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        setEligibilityAnswers(
                                                            (prev) => ({
                                                                ...prev,
                                                                abnormalGlucose:
                                                                    checked ===
                                                                    true,
                                                            })
                                                        )
                                                    }
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor="abnormalGlucose"
                                                    className="text-sm leading-relaxed cursor-pointer font-medium"
                                                >
                                                    Is blood glucose &lt;50
                                                    mg/dL or &gt;400 mg/dL?
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Layout - Grid */}
                                    <div className="hidden md:grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    id="highBP-desktop"
                                                    checked={
                                                        eligibilityAnswers.highBP
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        setEligibilityAnswers(
                                                            (prev) => ({
                                                                ...prev,
                                                                highBP:
                                                                    checked ===
                                                                    true,
                                                            })
                                                        )
                                                    }
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor="highBP-desktop"
                                                    className="text-sm leading-relaxed cursor-pointer font-medium"
                                                >
                                                    Is BP &gt;185/110?
                                                </Label>
                                            </div>

                                            {eligibilityAnswers.highBP && (
                                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Download className="w-4 h-4 text-red-600" />
                                                        <span className="text-sm font-medium text-red-800">
                                                            BP Management
                                                            Required
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-700 border-red-300 hover:bg-red-50"
                                                    >
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        Download
                                                        Antihypertensives Guide
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    id="abnormalGlucose-desktop"
                                                    checked={
                                                        eligibilityAnswers.abnormalGlucose
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        setEligibilityAnswers(
                                                            (prev) => ({
                                                                ...prev,
                                                                abnormalGlucose:
                                                                    checked ===
                                                                    true,
                                                            })
                                                        )
                                                    }
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor="abnormalGlucose-desktop"
                                                    className="text-sm leading-relaxed cursor-pointer font-medium"
                                                >
                                                    Is blood glucose &lt;50
                                                    mg/dL or &gt;400 mg/dL?
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Results */}
                            <div className="mt-6 md:mt-8">
                                {eligibilityStatus.status === "eligible" && (
                                    <Alert className="border-vital-green/30 bg-vital-green/10 clarity-shadow">
                                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-vital-green" />
                                        <AlertDescription className="text-deep-charcoal font-medium text-sm md:text-base">
                                            <strong className="text-vital-green">
                                                ✓ ELIGIBLE FOR THROMBOLYTIC
                                                THERAPY
                                            </strong>
                                            <br />
                                            {eligibilityStatus.message}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {eligibilityStatus.status === "correct" && (
                                    <Alert className="border-orange-200 bg-orange-50 shadow-lg">
                                        <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                                        <AlertDescription className="text-orange-800 font-medium text-sm md:text-base">
                                            <strong>
                                                ⚠ CORRECTION REQUIRED
                                            </strong>
                                            <br />
                                            {eligibilityStatus.message}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {eligibilityStatus.status === "evaluate" && (
                                    <Alert className="border-critical-crimson/30 bg-critical-crimson/10 clarity-shadow">
                                        <XCircle className="h-4 w-4 md:h-5 md:w-5 text-critical-crimson" />
                                        <AlertDescription className="text-red-800 font-medium text-sm md:text-base">
                                            <strong>
                                                ⚠ FURTHER EVALUATION NEEDED
                                            </strong>
                                            <br />
                                            {eligibilityStatus.message}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 md:pt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep("timers")}
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    Back to Timers
                                </Button>
                                <Button
                                    onClick={() =>
                                        setCurrentStep("drugSelection")
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                                    size="lg"
                                    disabled={
                                        eligibilityStatus.status !== "eligible"
                                    }
                                >
                                    Continue to Drug Selection
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Drug Selection - Mobile Optimized */}
                {currentStep === "drugSelection" && (
                    <Card className="mb-6 md:mb-8 shadow-xl border-0 bg-white">
                        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl">
                                <Activity className="w-5 h-5 md:w-6 md:h-6" />
                                Thrombolytic Drug Selection
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                            <div className="space-y-4 md:space-y-6">
                                {/* Drug Selection */}
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                                        Select Thrombolytic Drug
                                    </h3>

                                    {/* Mobile Layout - Stacked */}
                                    <div className="block md:hidden space-y-3">
                                        <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    id="tnk"
                                                    checked={
                                                        selectedDrug === "tnk"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked)
                                                            setSelectedDrug(
                                                                "tnk"
                                                            );
                                                    }}
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor="tnk"
                                                    className="text-sm leading-relaxed cursor-pointer font-medium"
                                                >
                                                    Tenecteplase (TNKase)
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    id="alteplase"
                                                    checked={
                                                        selectedDrug ===
                                                        "alteplase"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked)
                                                            setSelectedDrug(
                                                                "alteplase"
                                                            );
                                                    }}
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor="alteplase"
                                                    className="text-sm leading-relaxed cursor-pointer font-medium"
                                                >
                                                    Alteplase (Activase)
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Layout - Grid */}
                                    <div className="hidden md:grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    id="tnk-desktop"
                                                    checked={
                                                        selectedDrug === "tnk"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked)
                                                            setSelectedDrug(
                                                                "tnk"
                                                            );
                                                    }}
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor="tnk-desktop"
                                                    className="text-sm leading-relaxed cursor-pointer font-medium"
                                                >
                                                    Tenecteplase (TNKase)
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    id="alteplase-desktop"
                                                    checked={
                                                        selectedDrug ===
                                                        "alteplase"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked)
                                                            setSelectedDrug(
                                                                "alteplase"
                                                            );
                                                    }}
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor="alteplase-desktop"
                                                    className="text-sm leading-relaxed cursor-pointer font-medium"
                                                >
                                                    Alteplase (Activase)
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vial Size Selection */}
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                                        Select Vial Size (mg)
                                    </h3>

                                    <Select onValueChange={setVialSize}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose vial size (mg)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="25">
                                                25 mg
                                            </SelectItem>
                                            <SelectItem value="50">
                                                50 mg
                                            </SelectItem>
                                            <SelectItem value="100">
                                                100 mg
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Patient Weight Entry */}
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                                        Enter Patient Weight
                                    </h3>

                                    <div className="flex items-center space-x-3">
                                        <Input
                                            type="number"
                                            placeholder="Enter weight in kg or lbs"
                                            value={patientWeight}
                                            onChange={(e) =>
                                                setPatientWeight(e.target.value)
                                            }
                                            className="w-full"
                                        />
                                        <Select
                                            onValueChange={(value) =>
                                                setWeightUnit(
                                                    value as "kg" | "lbs"
                                                )
                                            }
                                            defaultValue={weightUnit}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Weight unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="kg">
                                                    kg
                                                </SelectItem>
                                                <SelectItem value="lbs">
                                                    lbs
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 md:pt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep("screening")}
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    Back to Screening
                                </Button>
                                <Button
                                    onClick={() => setCurrentStep("dosing")}
                                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                                    size="lg"
                                    disabled={
                                        !selectedDrug ||
                                        !vialSize ||
                                        !patientWeight
                                    }
                                >
                                    Continue to Dosing Calculation
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 5: Dosing Calculation - Mobile Optimized */}
                {currentStep === "dosing" && (
                    <Card className="mb-6 md:mb-8 shadow-xl border-0 bg-white">
                        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl">
                                <Calculator className="w-5 h-5 md:w-6 md:h-6" />
                                Thrombolytic Dosing Calculation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                            {doseCalculation ? (
                                <div className="space-y-4 md:space-y-6">
                                    {/* Dosage Information */}
                                    <div className="space-y-3 md:space-y-4">
                                        <h3 className="text-base md:text-lg font-semibold text-deep-charcoal border-b border-harbor-gray pb-2">
                                            Dosage Information
                                        </h3>

                                        {selectedDrug === "tnk" ? (
                                            <div className="p-4 md:p-6 border border-harbor-gray bg-white rounded-lg clarity-shadow">
                                                <h4 className="text-lg font-semibold text-deep-charcoal mb-4">
                                                    TNKase Dosing Result
                                                </h4>
                                                <div className="text-center mb-4">
                                                    <div className="result-score text-clinical-slate">
                                                        {
                                                            doseCalculation.totalDose
                                                        }{" "}
                                                        mg
                                                    </div>
                                                    <p className="text-base text-deep-charcoal font-medium">
                                                        Total TNKase Dose
                                                    </p>
                                                </div>
                                                <div className="space-y-2 text-deep-charcoal">
                                                    <p className="text-sm md:text-base">
                                                        <strong>
                                                            Total Volume:
                                                        </strong>{" "}
                                                        {doseCalculation.volume.toFixed(
                                                            2
                                                        )}{" "}
                                                        mL
                                                    </p>
                                                    <p className="text-sm md:text-base">
                                                        <strong>Waste:</strong>{" "}
                                                        {doseCalculation.waste}{" "}
                                                        mg
                                                    </p>
                                                    <p className="text-sm md:text-base">
                                                        <strong>
                                                            Waste Volume:
                                                        </strong>{" "}
                                                        {doseCalculation.wasteVolume.toFixed(
                                                            2
                                                        )}{" "}
                                                        mL
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 md:p-6 border border-harbor-gray bg-white rounded-lg clarity-shadow">
                                                <h4 className="text-lg font-semibold text-deep-charcoal mb-4">
                                                    Alteplase Dosing Result
                                                </h4>
                                                <div className="text-center mb-4">
                                                    <div className="result-score text-clinical-slate">
                                                        {doseCalculation.totalDose.toFixed(
                                                            2
                                                        )}{" "}
                                                        mg
                                                    </div>
                                                    <p className="text-base text-deep-charcoal font-medium">
                                                        Total Alteplase Dose
                                                    </p>
                                                </div>
                                                <div className="space-y-2 text-deep-charcoal">
                                                    <p className="text-sm md:text-base">
                                                        <strong>
                                                            Push Dose:
                                                        </strong>{" "}
                                                        {doseCalculation.pushDose?.toFixed(
                                                            2
                                                        )}{" "}
                                                        mg
                                                    </p>
                                                    <p className="text-sm md:text-base">
                                                        <strong>
                                                            Infusion Dose:
                                                        </strong>{" "}
                                                        {doseCalculation.infusionDose?.toFixed(
                                                            2
                                                        )}{" "}
                                                        mg
                                                    </p>
                                                    <p className="text-sm md:text-base">
                                                        <strong>
                                                            Total Volume:
                                                        </strong>{" "}
                                                        {doseCalculation.volume.toFixed(
                                                            2
                                                        )}{" "}
                                                        mL
                                                    </p>
                                                    <p className="text-sm md:text-base">
                                                        <strong>
                                                            Push Volume:
                                                        </strong>{" "}
                                                        {doseCalculation.pushVolume?.toFixed(
                                                            2
                                                        )}{" "}
                                                        mL
                                                    </p>
                                                    <p className="text-sm md:text-base">
                                                        <strong>
                                                            Infusion Volume:
                                                        </strong>{" "}
                                                        {doseCalculation.infusionVolume?.toFixed(
                                                            2
                                                        )}{" "}
                                                        mL
                                                    </p>
                                                    <p className="text-sm md:text-base">
                                                        <strong>Waste:</strong>{" "}
                                                        {doseCalculation.waste.toFixed(
                                                            2
                                                        )}{" "}
                                                        mg
                                                    </p>
                                                    <p className="text-sm md:text-base">
                                                        <strong>
                                                            Waste Volume:
                                                        </strong>{" "}
                                                        {doseCalculation.wasteVolume.toFixed(
                                                            2
                                                        )}{" "}
                                                        mL
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Administration Guidelines */}
                                    <div className="space-y-3 md:space-y-4">
                                        <h3 className="text-base md:text-lg font-semibold text-deep-charcoal border-b border-harbor-gray pb-2">
                                            Administration Guidelines
                                        </h3>

                                        {selectedDrug === "tnk" ? (
                                            <div className="p-3 md:p-4 border-2 border-gray-200 rounded-lg">
                                                <p className="text-sm md:text-base">
                                                    Administer TNKase as a
                                                    single IV bolus over 5
                                                    seconds.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="p-3 md:p-4 border-2 border-gray-200 rounded-lg">
                                                <p className="text-sm md:text-base">
                                                    Administer Alteplase as a
                                                    0.9 mg/kg IV dose (maximum
                                                    90 mg), with 10% of the
                                                    total dose administered as
                                                    an initial IV bolus over 1
                                                    minute, followed by
                                                    continuous infusion of the
                                                    remaining 90% of the total
                                                    dose over 60 minutes.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Alert className="border-orange-200 bg-orange-50 shadow-lg">
                                    <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                                    <AlertDescription className="text-orange-800 font-medium text-sm md:text-base">
                                        <strong>⚠ INSUFFICIENT DATA</strong>
                                        <br />
                                        Please ensure that a drug, vial size,
                                        and patient weight are selected.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 md:pt-6">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setCurrentStep("drugSelection")
                                    }
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    Back to Drug Selection
                                </Button>
                                <Button
                                    onClick={() => setCurrentStep("resources")}
                                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                                    size="lg"
                                    disabled={!doseCalculation}
                                >
                                    Continue to Resources
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 6: Resources - Mobile Optimized */}
                {currentStep === "resources" && (
                    <Card className="mb-6 md:mb-8 shadow-xl border-0 bg-white">
                        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl">
                                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                                Resources and Guidelines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                            <div className="space-y-4 md:space-y-6">
                                {/* Guidelines */}
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                                        Treatment Guidelines
                                    </h3>

                                    {/* Mobile Layout - Stacked */}
                                    <div className="block md:hidden space-y-3">
                                        <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <a
                                                href="https://www.stroke.org/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3"
                                            >
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    American Stroke Association
                                                    Guidelines
                                                </span>
                                            </a>
                                        </div>

                                        <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <a
                                                href="https://www.heart.org/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3"
                                            >
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    American Heart Association
                                                    Guidelines
                                                </span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Desktop Layout - Grid */}
                                    <div className="hidden md:grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <a
                                                href="https://www.stroke.org/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3"
                                            >
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    American Stroke Association
                                                    Guidelines
                                                </span>
                                            </a>
                                        </div>

                                        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <a
                                                href="https://www.heart.org/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3"
                                            >
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    American Heart Association
                                                    Guidelines
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Resources */}
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                                        Additional Resources
                                    </h3>

                                    {/* Mobile Layout - Stacked */}
                                    <div className="block md:hidden space-y-3">
                                        <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <a
                                                href="https://www.mdcalc.com/nihss-stroke-scale-score"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3"
                                            >
                                                <Eye className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    NIHSS Stroke Scale
                                                    Calculator
                                                </span>
                                            </a>
                                        </div>

                                        <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <a
                                                href="https://www.uptodate.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3"
                                            >
                                                <Users className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    UpToDate Clinical Resource
                                                </span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Desktop Layout - Grid */}
                                    <div className="hidden md:grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <a
                                                href="https://www.mdcalc.com/nihss-stroke-scale-score"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3"
                                            >
                                                <Eye className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    NIHSS Stroke Scale
                                                    Calculator
                                                </span>
                                            </a>
                                        </div>

                                        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <a
                                                href="https://www.uptodate.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3"
                                            >
                                                <Users className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    UpToDate Clinical Resource
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-4 md:pt-6">
                                <Button
                                    onClick={() => setCurrentStep("lkw")}
                                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                                    size="lg"
                                >
                                    Start New Code Stroke
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
