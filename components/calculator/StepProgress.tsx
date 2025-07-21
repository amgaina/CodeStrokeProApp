"use client";

import {
    CheckCircle,
    Clock,
    Timer,
    Shield,
    Activity,
    Calculator,
    BookOpen,
} from "lucide-react";

interface StepProgressProps {
    currentStep: "lkw" | "timers" | "screening" | "drugSelection" | "dosing";
    onStepChange?: (
        step: "lkw" | "timers" | "screening" | "drugSelection" | "dosing"
    ) => void;
}

export default function StepProgress({
    currentStep,
    onStepChange,
}: StepProgressProps) {
    const steps = [
        { key: "lkw", label: "LKW Time", icon: Clock, shortLabel: "LKW" },
        {
            key: "timers",
            label: "Code Timer",
            icon: Timer,
            shortLabel: "Timer",
        },
        {
            key: "screening",
            label: "Screening",
            icon: Shield,
            shortLabel: "Screen",
        },
        {
            key: "drugSelection",
            label: "Drug Selection",
            icon: Activity,
            shortLabel: "Drug",
        },
        {
            key: "dosing",
            label: "Dosing",
            icon: Calculator,
            shortLabel: "Dose",
        },
    ];

    const currentStepIndex = steps.findIndex(
        (step) => step.key === currentStep
    );

    return (
        <div className="mb-6 md:mb-8">
            <div className="bg-white rounded-xl clarity-shadow p-4 md:p-6 border border-harbor-gray">
                {/* Help Text */}
                {onStepChange && (
                    <div className="text-center mb-4">
                        <p className="text-xs text-deep-charcoal/60">
                            Click on completed steps (✓) to navigate back
                        </p>
                    </div>
                )}

                {/* Mobile & Tablet (≤md) */}
                <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 snap-x snap-mandatory justify-center">
                    {steps.map((step, index) => {
                        const isActive = currentStep === step.key;
                        const isCompleted = currentStepIndex > index;
                        const IconComponent = step.icon;

                        return (
                            <div
                                key={step.key}
                                className="flex flex-col items-center w-20 flex-shrink-0 snap-center"
                            >
                                <button
                                    onClick={() =>
                                        onStepChange?.(step.key as any)
                                    }
                                    disabled={
                                        !onStepChange ||
                                        (!isCompleted && !isActive)
                                    }
                                    className={`
                                        transition-transform duration-300 rounded-full
                                        ${
                                            index == 0 ? "w-10" : "w-20"
                                        } h-10 sm:w-11 sm:h-11
                                        flex items-center justify-center text-xs font-medium
                                        ${
                                            isActive
                                                ? "bg-clinical-slate text-parchment clarity-shadow scale-110"
                                                : isCompleted
                                                ? "bg-vital-green text-parchment hover:bg-vital-green/80 cursor-pointer"
                                                : "bg-harbor-gray text-deep-charcoal"
                                        }
                                        ${
                                            onStepChange &&
                                            (isCompleted || isActive)
                                                ? "hover:scale-105 active:scale-95"
                                                : ""
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <IconComponent className="w-4 h-4" />
                                    )}
                                </button>
                                <span
                                    className={`mt-1 text-xs font-medium text-center ${
                                        isActive
                                            ? "text-clinical-slate"
                                            : "text-deep-charcoal"
                                    }`}
                                >
                                    {step.shortLabel}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Desktop (≥md) */}
                <div className="hidden md:flex items-center overflow-x-auto">
                    {steps.map((step, index) => {
                        const isActive = currentStep === step.key;
                        const isCompleted = currentStepIndex > index;
                        const IconComponent = step.icon;

                        return (
                            <div
                                key={step.key}
                                className={`flex items-center ${
                                    index === steps.length - 1
                                        ? "min-w-content"
                                        : "flex-1 min-w-[110px]"
                                }`}
                            >
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <button
                                        onClick={() =>
                                            onStepChange?.(step.key as any)
                                        }
                                        disabled={
                                            !onStepChange ||
                                            (!isCompleted && !isActive)
                                        }
                                        className={`
                                            transition-transform duration-300 rounded-full
                                            w-11 h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14
                                            flex items-center justify-center text-sm font-medium
                                            ${
                                                isActive
                                                    ? "bg-clinical-slate text-parchment clarity-shadow scale-110"
                                                    : isCompleted
                                                    ? "bg-vital-green text-parchment hover:bg-vital-green/80 cursor-pointer"
                                                    : "bg-harbor-gray text-deep-charcoal"
                                            }
                                            ${
                                                onStepChange &&
                                                (isCompleted || isActive)
                                                    ? "hover:scale-105 active:scale-95"
                                                    : ""
                                            }
                                        `}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                                        ) : (
                                            <IconComponent className="w-5 h-5 lg:w-6 lg:h-6" />
                                        )}
                                    </button>
                                    <span
                                        className={`mt-2 text-xs font-medium whitespace-nowrap ${
                                            isActive
                                                ? "text-clinical-slate"
                                                : "text-deep-charcoal"
                                        }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>

                                {/* Connector */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-1 lg:mx-2 ${
                                            isCompleted
                                                ? "bg-vital-green"
                                                : "bg-harbor-gray"
                                        }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
