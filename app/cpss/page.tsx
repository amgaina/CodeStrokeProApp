"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Shield,
    Info,
    CheckCircle,
    XCircle,
    Download,
    AlertTriangle,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useCpssPdf from "@/hooks/use-cpss-pdf";
import { trackToolCompleted, trackPdfDownloaded } from "@/lib/analytics";

export default function CincinnatiStrokeScale() {
    const [answers, setAnswers] = useState<{
        facialDroop: boolean | null;
        armDrift: boolean | null;
        speech: boolean | null;
    }>({
        facialDroop: null,
        armDrift: null,
        speech: null,
    });

    const mainRef = useRef<HTMLDivElement>(null);

    // Determine if any positive signs are present
    const hasPositiveSign = Object.values(answers).some(
        (value) => value === true
    );

    // Determine if assessment is complete
    const isComplete = Object.values(answers).every((value) => value !== null);

    // Reset all answers
    const resetAnswers = () => {
        setAnswers({
            facialDroop: null,
            armDrift: null,
            speech: null,
        });
    };

    // Initialize the PDF generation hook
    const { generatePDF } = useCpssPdf({
        answers,
        hasPositiveSign,
        isComplete,
    });

    // De-identified interpretation: positive/negative + count of abnormal findings
    const abnormalCount = Object.values(answers).filter(
        (value) => value === true
    ).length;
    const interpretation = hasPositiveSign ? "positive" : "negative";

    // Fire completion event exactly once per completion
    const completionTracked = useRef(false);
    useEffect(() => {
        if (isComplete && !completionTracked.current) {
            completionTracked.current = true;
            trackToolCompleted("cpss", {
                result: interpretation,
                abnormalCount,
            });
        } else if (!isComplete) {
            completionTracked.current = false;
        }
    }, [isComplete, interpretation, abnormalCount]);

    // Wrapper so all download buttons emit the same de-identified event
    const handleDownloadPDF = () => {
        generatePDF();
        trackPdfDownloaded("cpss", { result: interpretation });
    };

    // Scroll to top when page loads
    useEffect(() => {
        if (mainRef.current) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, []);

    return (
        <div ref={mainRef} className="min-h-screen bg-parchment">
            {/* Sticky header panel - always visible */}
            <div className="sticky top-[65px] z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto max-w-5xl px-3">
                    <div className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-base text-gray-700">
                                Status:
                            </span>
                            {isComplete ? (
                                hasPositiveSign ? (
                                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                        Positive Screen - Stroke Likely
                                    </div>
                                ) : (
                                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                        Negative Screen
                                    </div>
                                )
                            ) : (
                                <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                    Incomplete Assessment
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Progress indicator */}
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-xs text-gray-600">
                                    {
                                        Object.values(answers).filter(
                                            (a) => a !== null
                                        ).length
                                    }{" "}
                                    of {Object.keys(answers).length} completed
                                </span>
                                <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-300 ease-in-out"
                                        style={{
                                            width: `${
                                                (Object.values(answers).filter(
                                                    (a) => a !== null
                                                ).length /
                                                    Object.keys(answers)
                                                        .length) *
                                                100
                                            }%`,
                                            backgroundColor: isComplete
                                                ? hasPositiveSign
                                                    ? "#f59e0b" // amber-500
                                                    : "#22c55e" // green-500
                                                : "#64748b", // slate-500
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Download PDF button - only shows when assessment is complete */}
                            {isComplete && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleDownloadPDF}
                                    className="h-7 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 hidden md:flex items-center mt-2"
                                    name="download-pdf"
                                >
                                    <Download className="w-3.5 h-3.5 mr-1" />
                                    Download PDF
                                </Button>
                            )}

                            {/* Reset button */}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={resetAnswers}
                                className="h-7 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 mt-2"
                                name="reset-assessment"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-5xl px-3 py-4 md:py-6">
                {/* Header with instructions */}
                <div className="mb-4 text-center">
                    <h1 className="text-2xl md:text-3xl font-semibold text-deep-charcoal">
                        Cincinnati Prehospital Stroke Scale (CPSS)
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Quick 3-question checklist to assess potential stroke.
                        If any answer is "Yes," stroke is likely.
                    </p>
                </div>

                {/* Assessment Summary Card */}
                <Card className="mb-6 shadow-sm border border-gray-200 bg-white overflow-hidden">
                    <CardHeader
                        className={`p-4 ${
                            isComplete
                                ? hasPositiveSign
                                    ? "bg-amber-700 text-deep-charcoal" // dark amber background, high contrast text
                                    : "bg-green-700 text-white" // dark green background, white text
                                : "bg-gray-700 text-white" // dark gray background, white text
                        }`}
                    >
                        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                            <Shield className="w-5 h-5" />
                            Assessment Result
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="mb-3 md:mb-0">
                                <h2 className="font-semibold text-lg mb-1 text-gray-800">
                                    {isComplete
                                        ? hasPositiveSign
                                            ? "Positive Screen — Stroke Likely"
                                            : "Negative Screen"
                                        : "Assessment Incomplete"}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {isComplete
                                        ? hasPositiveSign
                                            ? "~72% probability of stroke with any 1 of 3 signs present."
                                            : "No signs of stroke detected."
                                        : "Please complete all three questions to get an assessment."}
                                </p>

                                {isComplete && hasPositiveSign && (
                                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                                        <p className="text-xs text-gray-700">
                                            Positive result suggests high
                                            likelihood of stroke. Immediate
                                            medical attention is recommended.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    Completed
                                </div>
                                <div className="relative w-16 h-16">
                                    <svg
                                        className="w-16 h-16 transform -rotate-90"
                                        viewBox="0 0 100 100"
                                    >
                                        <circle
                                            className="text-gray-200"
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            strokeWidth="10"
                                            stroke="currentColor"
                                            fill="transparent"
                                        />
                                        <circle
                                            className={`
                                                ${
                                                    isComplete
                                                        ? hasPositiveSign
                                                            ? "text-urgent-amber"
                                                            : "text-vital-green"
                                                        : "text-clinical-slate/60"
                                                }
                                            `}
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            strokeWidth="10"
                                            stroke="currentColor"
                                            fill="transparent"
                                            strokeLinecap="round"
                                            strokeDasharray="282.7"
                                            strokeDashoffset={
                                                282.7 -
                                                (282.7 *
                                                    Object.values(
                                                        answers
                                                    ).filter((a) => a !== null)
                                                        .length) /
                                                    3
                                            }
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-bold text-gray-700">
                                            {Math.round(
                                                (Object.values(answers).filter(
                                                    (a) => a !== null
                                                ).length /
                                                    3) *
                                                    100
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={resetAnswers}
                                    className="mt-2"
                                    name="reset-assessment"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Assessment Questions */}
                <Card className="shadow-sm border border-gray-200 bg-white">
                    <CardHeader className="bg-clinical-slate text-parchment p-3 md:p-4">
                        <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-medium">
                            <Shield className="w-5 h-5" />
                            CPSS Assessment Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 space-y-5">
                        <div className="flex items-center p-2.5 bg-blue-50/50 rounded-lg border border-blue-100/70">
                            <Info className="mr-2 h-4 w-4 text-blue-600" />
                            <p className="text-sm text-gray-600">
                                Answer all three questions. Abnormal finding on
                                any single item suggests stroke with
                                approximately 72% probability.
                            </p>
                        </div>

                        {/* Facial Droop Question */}
                        <StrokeQuestion
                            title="Facial Droop"
                            instructions="Ask the patient to smile or show their teeth."
                            options={[
                                {
                                    value: false,
                                    label: "Normal: Both sides of face move equally",
                                },
                                {
                                    value: true,
                                    label: "Abnormal: One side of face does not move as well as the other",
                                },
                            ]}
                            value={answers.facialDroop}
                            onChange={(value) =>
                                setAnswers((prev) => ({
                                    ...prev,
                                    facialDroop: value,
                                }))
                            }
                        />

                        {/* Arm Drift Question */}
                        <StrokeQuestion
                            title="Arm Drift"
                            instructions="Ask patient to close eyes and hold both arms out with palms up for 10 seconds."
                            options={[
                                {
                                    value: false,
                                    label: "Normal: Both arms move equally or not at all",
                                },
                                {
                                    value: true,
                                    label: "Abnormal: One arm doesn't move or drifts down compared to the other",
                                },
                            ]}
                            value={answers.armDrift}
                            onChange={(value) =>
                                setAnswers((prev) => ({
                                    ...prev,
                                    armDrift: value,
                                }))
                            }
                        />

                        {/* Speech Question */}
                        <StrokeQuestion
                            title="Speech"
                            instructions="Ask patient to repeat a simple phrase like 'The sky is blue in Cincinnati.'"
                            options={[
                                {
                                    value: false,
                                    label: "Normal: Patient says correct words with no slurring",
                                },
                                {
                                    value: true,
                                    label: "Abnormal: Patient slurs words, says wrong words, or is unable to speak",
                                },
                            ]}
                            value={answers.speech}
                            onChange={(value) =>
                                setAnswers((prev) => ({
                                    ...prev,
                                    speech: value,
                                }))
                            }
                        />

                        {/* Result Summary */}
                        {isComplete && (
                            <div
                                className={`mt-8 p-4 rounded-lg border ${
                                    hasPositiveSign
                                        ? "bg-amber-50/50 border-amber-200"
                                        : "bg-green-50/50 border-green-200"
                                }`}
                            >
                                <h3 className="font-semibold text-lg mb-2 flex items-center">
                                    {hasPositiveSign ? (
                                        <>
                                            <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                                            <span className="text-amber-800">
                                                Positive Screen — Stroke Likely
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                            <span className="text-green-800">
                                                Negative Screen
                                            </span>
                                        </>
                                    )}
                                </h3>
                                <p className="text-gray-700">
                                    {hasPositiveSign
                                        ? "One or more abnormal findings detected. ~72% probability of stroke. Consider immediate further assessment."
                                        : "No abnormal findings detected. However, this does not completely rule out stroke if symptoms are concerning."}
                                </p>
                                <div className="mt-4 space-y-2">
                                    <h4 className="font-medium text-gray-700">
                                        Assessment Summary:
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <SummaryItem
                                            title="Facial Droop"
                                            status={answers.facialDroop}
                                        />
                                        <SummaryItem
                                            title="Arm Drift"
                                            status={answers.armDrift}
                                        />
                                        <SummaryItem
                                            title="Speech"
                                            status={answers.speech}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-center gap-3 flex-wrap">
                                    <Button
                                        onClick={handleDownloadPDF}
                                        variant="outline"
                                        className="w-full md:w-auto flex items-center"
                                        name="download-pdf"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF Report
                                    </Button>
                                    <Button
                                        onClick={resetAnswers}
                                        className="w-full md:w-auto"
                                        name="reset-assessment"
                                    >
                                        Reset Assessment
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

// StrokeQuestion Component
function StrokeQuestion({
    title,
    instructions,
    options,
    value,
    onChange,
}: {
    title: string;
    instructions: string;
    options: { value: boolean; label: string }[];
    value: boolean | null;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="mb-5 rounded-lg border border-gray-200 p-3 bg-white hover:shadow-sm transition-shadow">
            <div className="mb-3">
                <h2 className="text-base font-semibold text-deep-charcoal mb-1.5 flex items-center">
                    <span className="w-6 h-6 bg-clinical-slate text-white rounded-full mr-2 flex items-center justify-center text-xs">
                        ?
                    </span>
                    {title}
                </h2>
                <p className="text-sm text-gray-500 mb-2 pl-8">
                    {instructions}
                </p>
            </div>

            <RadioGroup
                value={value !== null ? value.toString() : undefined}
                onValueChange={(val) => {
                    onChange(val === "true");
                }}
            >
                <div className="space-y-1.5 pl-8">
                    {options.map((option) => {
                        const isAbnormal = option.value === true;
                        const isSelected = value === option.value;

                        return (
                            <div
                                key={option.value.toString()}
                                className={`flex items-start p-2.5 rounded-md border transition-all
                                    ${
                                        isSelected
                                            ? isAbnormal
                                                ? "bg-amber-50/50 border-amber-100 shadow-sm"
                                                : "bg-green-50/50 border-green-100 shadow-sm"
                                            : "hover:bg-gray-50/70 border-gray-100"
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem
                                        value={option.value.toString()}
                                        id={`${title}-${option.value}`}
                                        className="mt-0"
                                    />
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-sm flex-shrink-0
                                            ${
                                                isAbnormal
                                                    ? "bg-amber-400"
                                                    : "bg-green-400"
                                            }`}
                                    >
                                        {isAbnormal ? "!" : "✓"}
                                    </div>
                                    <Label
                                        htmlFor={`${title}-${option.value}`}
                                        className="text-sm leading-normal cursor-pointer flex-grow"
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </RadioGroup>
        </div>
    );
}

// SummaryItem Component
function SummaryItem({
    title,
    status,
}: {
    title: string;
    status: boolean | null;
}) {
    return (
        <div
            className={`flex items-center p-2 rounded border ${
                status === true
                    ? "bg-amber-50 border-amber-200"
                    : status === false
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
            }`}
        >
            {status === true ? (
                <XCircle className="h-5 w-5 text-amber-600 mr-2" />
            ) : status === false ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
                <Info className="h-5 w-5 text-gray-400 mr-2" />
            )}
            <div>
                <span className="text-sm font-medium text-gray-700">
                    {title}:{" "}
                </span>
                <span
                    className={`text-sm ${
                        status === true
                            ? "text-amber-700"
                            : status === false
                            ? "text-green-700"
                            : "text-gray-500"
                    }`}
                >
                    {status === true
                        ? "Abnormal"
                        : status === false
                        ? "Normal"
                        : "Not assessed"}
                </span>
            </div>
        </div>
    );
}
