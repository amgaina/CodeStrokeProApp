"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    Stethoscope,
    Home,
    BookOpen,
    X,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

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

    const [showResourcesPopup, setShowResourcesPopup] = useState(false);

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

    const handleStepChange = (
        step:
            | "lkw"
            | "timers"
            | "screening"
            | "drugSelection"
            | "dosing"
            | "resources"
    ) => {
        setCurrentStep(step);
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
            {/* Compact Sticky Header */}
            <header className="sticky top-0 z-50 bg-clinical-slate text-parchment clarity-shadow border-b border-harbor-gray backdrop-blur-sm">
                <div className="container mx-auto px-4 py-2 md:py-3">
                    {/* Main Header Content - Compact */}
                    <div className="flex items-center justify-between gap-2 md:gap-4">
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="bg-white/10 p-1.5 md:p-2 rounded-full">
                                <Stethoscope className="w-4 h-4 md:w-5 md:h-5 text-parchment/80" />
                            </div>
                            <Link
                                href="/"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <h1 className="text-lg md:text-xl font-semibold tracking-tight text-parchment">
                                    CodeStroke Pro
                                </h1>
                                <p className="text-parchment/80 text-xs md:text-sm font-medium leading-tight">
                                    Clinical Decision Support
                                </p>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Home Link Button */}
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/10 border-white/20 text-parchment hover:bg-white/20 hover:text-parchment px-2 py-1 h-8"
                                >
                                    <Home className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                    <span className="hidden sm:inline text-xs">
                                        Home
                                    </span>
                                </Button>
                            </Link>
                            <div className="text-right">
                                <div className="bg-white/10 px-2 py-1 rounded">
                                    <p className="text-parchment/80 text-xs font-medium">
                                        Funded by
                                    </p>
                                    <p className="font-semibold text-xs text-parchment leading-tight">
                                        Living Well Foundation
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Timer Display */}
                    {(timers.lkwTime || timers.arrivalTime) && (
                        <div className="border-t border-clinical-slate/20 mt-2 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {/* LKW Timer in Header - Compact */}
                                {timers.lkwTime && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded p-2 border border-white/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-parchment/80 text-xs font-medium">
                                                    4.5hr Window
                                                </h3>
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
                                                                className={`text-sm font-bold ${
                                                                    isExpired
                                                                        ? "text-critical-crimson"
                                                                        : "text-parchment"
                                                                }`}
                                                            >
                                                                {isExpired
                                                                    ? "EXPIRED"
                                                                    : timeText}
                                                            </p>
                                                            <p className="text-parchment/70 text-xs">
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

                                {/* Door-to-Needle Timer in Header - Compact */}
                                {timers.arrivalTime && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded p-2 border border-white/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-parchment/80 text-xs font-medium">
                                                    Door-to-Needle
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-parchment text-sm font-bold">
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
                                                <div className="inline-flex items-center gap-1 bg-critical-crimson text-white text-xs font-medium px-1.5 py-0.5 rounded">
                                                    <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
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
                <StepProgress
                    currentStep={currentStep}
                    onStepChange={handleStepChange}
                />

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
                        onBack={() => setCurrentStep("lkw")}
                    />
                )}

                {/* Step 3: Eligibility Screening */}
                {currentStep === "screening" && (
                    <EligibilityScreening
                        answers={eligibilityAnswers}
                        onAnswerChange={handleEligibilityChange}
                        onNext={() => setCurrentStep("drugSelection")}
                        onBack={() => setCurrentStep("timers")}
                    />
                )}

                {/* Step 4: Drug Selection */}
                {currentStep === "drugSelection" && (
                    <DrugSelection
                        selectedDrug={selectedDrug}
                        onDrugSelect={handleDrugSelect}
                        onNext={() => setCurrentStep("dosing")}
                        onBack={() => setCurrentStep("screening")}
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
                        onBack={() => setCurrentStep("drugSelection")}
                    />
                )}

                {/* Step 5 Fallback: If no drug selected, redirect back */}
                {currentStep === "dosing" && !selectedDrug && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                            Please select a drug first.
                        </p>
                        <Button onClick={() => setCurrentStep("drugSelection")}>
                            Go Back to Drug Selection
                        </Button>
                    </div>
                )}

                {/* Step 6: Clinical Resources */}
                {currentStep === "resources" && (
                    <ClinicalResources
                        onRestart={handleRestart}
                        onBack={() => setCurrentStep("dosing")}
                    />
                )}
            </div>

            {/* Floating Resources Button - Always Visible */}
            <div className="fixed bottom-6 right-6 z-40">
                <Dialog
                    open={showResourcesPopup}
                    onOpenChange={setShowResourcesPopup}
                >
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            className="bg-vital-green hover:bg-vital-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 p-0 group"
                            title="Quick Resources"
                        >
                            <BookOpen className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl text-deep-charcoal">
                                <BookOpen className="h-5 w-5 text-vital-green" />
                                Quick Clinical Resources
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Emergency Guidelines */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-deep-charcoal border-b border-harbor-gray pb-2">
                                    Emergency Guidelines
                                </h3>
                                <div className="space-y-2">
                                    <ResourcePopupLink
                                        href="https://www.ahajournals.org/doi/10.1161/STROKEAHA.119.025225"
                                        title="2019 AHA/ASA Guidelines for Early Management of Acute Ischemic Stroke"
                                        description="Primary guidelines for thrombolytic therapy"
                                    />
                                    <ResourcePopupLink
                                        href="https://www.stroke.org/-/media/stroke-files/professional-stroke-resource-library/2022-guideline-for-the-management-of-spontaneous-ich.pdf"
                                        title="2022 Guideline for Management of Spontaneous ICH"
                                        description="Hemorrhagic stroke management"
                                    />
                                </div>
                            </div>

                            {/* Drug Information */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-deep-charcoal border-b border-harbor-gray pb-2">
                                    Drug Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-clinical-slate/10 border border-clinical-slate/30 rounded-lg p-3">
                                        <h4 className="font-medium text-clinical-slate text-sm mb-2">
                                            Alteplase (tPA)
                                        </h4>
                                        <ul className="text-xs text-deep-charcoal space-y-1">
                                            <li>• 0.9 mg/kg (max 90 mg)</li>
                                            <li>
                                                • 10% bolus, 90% over 60 min
                                            </li>
                                            <li>• 3-4.5 hour window</li>
                                        </ul>
                                    </div>
                                    <div className="bg-vital-green/10 border border-vital-green/30 rounded-lg p-3">
                                        <h4 className="font-medium text-vital-green text-sm mb-2">
                                            Tenecteplase (TNK)
                                        </h4>
                                        <ul className="text-xs text-deep-charcoal space-y-1">
                                            <li>• 0.25 mg/kg (max 25 mg)</li>
                                            <li>
                                                • Single bolus over 5 seconds
                                            </li>
                                            <li>• 3-4.5 hour window</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Reference */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-deep-charcoal border-b border-harbor-gray pb-2">
                                    Quick Reference
                                </h3>
                                <div className="bg-urgent-amber/10 border border-urgent-amber/30 rounded-lg p-4">
                                    <h4 className="font-medium text-urgent-amber text-sm mb-2">
                                        Time Targets
                                    </h4>
                                    <ul className="text-xs text-deep-charcoal space-y-1">
                                        <li>• Door-to-CT: &lt; 25 minutes</li>
                                        <li>
                                            • Door-to-Needle: &lt; 60 minutes
                                        </li>
                                        <li>• LKW-to-Needle: &lt; 4.5 hours</li>
                                        <li>• Onset-to-Door: Minimize</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Contraindications Checklist */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-deep-charcoal border-b border-harbor-gray pb-2">
                                    Major Contraindications
                                </h3>
                                <div className="bg-critical-crimson/10 border border-critical-crimson/30 rounded-lg p-4">
                                    <ul className="text-xs text-deep-charcoal space-y-1">
                                        <li>• Active internal bleeding</li>
                                        <li>
                                            • Recent surgery/trauma (&lt;14
                                            days)
                                        </li>
                                        <li>• History of ICH</li>
                                        <li>• BP &gt; 185/110 mmHg</li>
                                        <li>• Platelets &lt; 100,000</li>
                                        <li>
                                            • INR &gt; 1.7 or PT &gt; 15 sec
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Additional Resources */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-deep-charcoal border-b border-harbor-gray pb-2">
                                    Additional Resources
                                </h3>
                                <div className="space-y-2">
                                    <ResourcePopupLink
                                        href="https://www.ninds.nih.gov/"
                                        title="NINDS - National Institute of Neurological Disorders"
                                        description="Research and clinical information"
                                    />
                                    <ResourcePopupLink
                                        href="https://www.stroke.org/"
                                        title="American Stroke Association"
                                        description="Patient and provider resources"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-harbor-gray">
                            <p className="text-xs text-deep-charcoal/60 text-center">
                                For complete clinical workflow, visit the
                                Resources tab
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

// Helper component for Resource Popup Links
const ResourcePopupLink = ({
    href,
    title,
    description,
}: {
    href: string;
    title: string;
    description: string;
}) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white border border-harbor-gray rounded-lg p-3 hover:bg-harbor-gray/10 transition-colors group"
    >
        <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
                <h4 className="text-sm font-medium text-deep-charcoal group-hover:text-vital-green transition-colors">
                    {title}
                </h4>
                <p className="text-xs text-deep-charcoal/60 mt-1">
                    {description}
                </p>
            </div>
            <ExternalLink className="h-4 w-4 text-deep-charcoal/40 group-hover:text-vital-green transition-colors flex-shrink-0" />
        </div>
    </a>
);
