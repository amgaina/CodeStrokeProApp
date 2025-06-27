"use client";

import { useState, useEffect } from "react";
import { Activity, Stethoscope } from "lucide-react";

// Import our modular components
import LKWTimeEntry from "@/components/calculator/LKWTimeEntry";
import CodeStrokeTimers from "@/components/calculator/CodeStrokeTimers";
import EligibilityScreening from "@/components/calculator/EligibilityScreening";
import DrugSelection from "@/components/calculator/DrugSelection";
import DosingCalculator from "@/components/calculator/DosingCalculator";
import ClinicalResources from "@/components/calculator/ClinicalResources";
import StepProgress from "@/components/calculator/StepProgress";

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
            rapidImprovement: false,
            minorSymptoms: false,
            recentSurgery: false,
            activeBleed: false,
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

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prev) => ({ ...prev, currentTime: new Date() }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Handler functions
    const handleLKWTimeSet = (time: Date) => {
        setTimers((prev) => ({ ...prev, lkwTime: time }));
    };

    const handleStartArrivalTimer = () => {
        setTimers((prev) => ({ ...prev, arrivalTime: new Date() }));
    };

    const handleEligibilityChange = (answers: EligibilityAnswers) => {
        setEligibilityAnswers(answers);
    };

    const handleDrugSelect = (drug: "tnk" | "alteplase") => {
        setSelectedDrug(drug);
        // Set default vial size based on drug selection
        if (drug === "tnk") {
            setVialSize("50");
        } else {
            setVialSize("100");
        }
    };

    const handleRestart = () => {
        setTimers({
            lkwTime: null,
            arrivalTime: null,
            currentTime: new Date(),
        });
        setEligibilityAnswers({
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
        setSelectedDrug(null);
        setVialSize("");
        setPatientWeight("");
        setWeightUnit("kg");
        setCurrentStep("lkw");
    };

    return (
        <div className="min-h-screen bg-parchment">
            {/* Enhanced Header with Timers */}
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
                                    CodeStroke Pro
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

                    {/* Header Timers Display */}
                    {(timers.lkwTime || timers.arrivalTime) && (
                        <div className="border-t border-clinical-slate/20 mt-4 md:mt-6 pt-4 md:pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* LKW Timer in Header */}
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
                                                    const fourHourLimit =
                                                        new Date(
                                                            timers.lkwTime.getTime() +
                                                                4.5 *
                                                                    60 *
                                                                    60 *
                                                                    1000
                                                        );
                                                    const diff =
                                                        fourHourLimit.getTime() -
                                                        timers.currentTime.getTime();
                                                    const isExpired = diff <= 0;
                                                    const hours = Math.floor(
                                                        Math.abs(diff) /
                                                            (1000 * 60 * 60)
                                                    );
                                                    const minutes = Math.floor(
                                                        (Math.abs(diff) %
                                                            (1000 * 60 * 60)) /
                                                            (1000 * 60)
                                                    );
                                                    const seconds = Math.floor(
                                                        (Math.abs(diff) %
                                                            (1000 * 60)) /
                                                            1000
                                                    );
                                                    const timeText = `${hours}h ${minutes}m ${seconds}s`;

                                                    return (
                                                        <>
                                                            <p
                                                                className={`text-lg font-bold ${
                                                                    isExpired
                                                                        ? "text-red-300"
                                                                        : "text-white"
                                                                }`}
                                                            >
                                                                {isExpired
                                                                    ? "EXPIRED"
                                                                    : timeText}
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

                                {/* Door-to-Needle Timer in Header */}
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
                                                    {(() => {
                                                        const diff = Math.max(
                                                            0,
                                                            timers.currentTime.getTime() -
                                                                timers.arrivalTime.getTime()
                                                        );
                                                        const hours =
                                                            Math.floor(
                                                                diff /
                                                                    (1000 *
                                                                        60 *
                                                                        60)
                                                            );
                                                        const minutes =
                                                            Math.floor(
                                                                (diff %
                                                                    (1000 *
                                                                        60 *
                                                                        60)) /
                                                                    (1000 * 60)
                                                            );
                                                        const seconds =
                                                            Math.floor(
                                                                (diff %
                                                                    (1000 *
                                                                        60)) /
                                                                    1000
                                                            );
                                                        return `${hours}h ${minutes}m ${seconds}s`;
                                                    })()}
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
                        </div>
                    )}
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
                {/* Step Progress Indicator */}
                <StepProgress currentStep={currentStep} />

                {/* Step 1: LKW Time Entry */}
                {currentStep === "lkw" && (
                    <LKWTimeEntry
                        lkwTime={timers.lkwTime}
                        onTimeSet={handleLKWTimeSet}
                        onNext={() => setCurrentStep("timers")}
                    />
                )}

                {/* Step 2: Code Stroke Timers */}
                {currentStep === "timers" && (
                    <CodeStrokeTimers
                        timers={timers}
                        onStartArrivalTimer={handleStartArrivalTimer}
                        onNext={() => setCurrentStep("screening")}
                    />
                )}

                {/* Step 3: Eligibility Screening */}
                {currentStep === "screening" && (
                    <EligibilityScreening
                        answers={eligibilityAnswers}
                        onAnswerChange={handleEligibilityChange}
                        onNext={() => setCurrentStep("drugSelection")}
                    />
                )}

                {/* Step 4: Drug Selection */}
                {currentStep === "drugSelection" && (
                    <DrugSelection
                        selectedDrug={selectedDrug}
                        onDrugSelect={handleDrugSelect}
                        onNext={() => setCurrentStep("dosing")}
                    />
                )}

                {/* Step 5: Dosing Calculator */}
                {currentStep === "dosing" && selectedDrug && (
                    <DosingCalculator
                        selectedDrug={selectedDrug}
                        patientWeight={patientWeight}
                        weightUnit={weightUnit}
                        vialSize={vialSize}
                        onWeightChange={setPatientWeight}
                        onWeightUnitChange={setWeightUnit}
                        onVialSizeChange={setVialSize}
                        onNext={() => setCurrentStep("resources")}
                    />
                )}

                {/* Step 6: Clinical Resources */}
                {currentStep === "resources" && (
                    <ClinicalResources onRestart={handleRestart} />
                )}
            </div>
        </div>
    );
}
