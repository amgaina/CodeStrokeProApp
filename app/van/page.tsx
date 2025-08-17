"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Shield,
    Info,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Eye,
    Brain,
    ArrowRight,
    Download,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useVanPdf from "@/hooks/use-van-pdf";

export default function VANAssessment() {
    const [weaknessPresent, setWeaknessPresent] = useState<boolean | null>(
        null
    );
    const [checkItems, setCheckItems] = useState({
        vision: false,
        aphasia: false,
        neglect: false,
    });

    const mainRef = useRef<HTMLDivElement>(null);

    // Determine assessment status
    const isStep1Complete = weaknessPresent !== null;
    const isVANPositive =
        weaknessPresent === true &&
        (checkItems.vision || checkItems.aphasia || checkItems.neglect);
    const isVANNegative =
        weaknessPresent === false ||
        (weaknessPresent === true &&
            !checkItems.vision &&
            !checkItems.aphasia &&
            !checkItems.neglect);
    const isAssessmentComplete =
        isStep1Complete &&
        (weaknessPresent === false ||
            (weaknessPresent === true && (isVANPositive || isVANNegative)));

    // Reset assessment
    const resetAssessment = () => {
        setWeaknessPresent(null);
        setCheckItems({
            vision: false,
            aphasia: false,
            neglect: false,
        });
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

    // Use our custom PDF generation hook
    const { generatePDF } = useVanPdf({
        weaknessPresent,
        checkItems,
        isVANPositive,
        isVANNegative,
        isAssessmentComplete,
    });

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
                            {isAssessmentComplete ? (
                                isVANPositive ? (
                                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                        VAN Positive - High Likelihood of LVO
                                    </div>
                                ) : (
                                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                        VAN Negative
                                    </div>
                                )
                            ) : (
                                <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                    Assessment Incomplete
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Progress indicator */}
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-xs text-gray-600">
                                    Step{" "}
                                    {isStep1Complete && weaknessPresent
                                        ? "2"
                                        : "1"}{" "}
                                    of 2
                                </span>
                                <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-300 ease-in-out"
                                        style={{
                                            width: `${
                                                isStep1Complete &&
                                                weaknessPresent
                                                    ? 100
                                                    : 50
                                            }%`,
                                            backgroundColor:
                                                isAssessmentComplete
                                                    ? isVANPositive
                                                        ? "#ef4444" // red-500
                                                        : "#22c55e" // green-500
                                                    : "#64748b", // slate-500
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Download button */}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={generatePDF}
                                disabled={!isAssessmentComplete}
                                className="h-7 px-2 text-sm flex items-center gap-1 mt-2"
                            >
                                <Download className="h-3.5 w-3.5" />
                                <span className="hidden md:inline">
                                    Download
                                </span>
                            </Button>

                            {/* Reset button */}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={resetAssessment}
                                className="h-7 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 mt-2"
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
                        VAN (Vision, Aphasia, Neglect) Assessment
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Quick test for possible large vessel occlusion (LVO)
                        stroke.
                    </p>
                </div>

                {/* Assessment Summary Card */}
                <Card className="mb-6 shadow-sm border border-gray-200 bg-white overflow-hidden">
                    <CardHeader
                        className={`p-4 ${
                            isAssessmentComplete
                                ? isVANPositive
                                    ? "bg-critical-crimson"
                                    : "bg-vital-green"
                                : "bg-harbor-gray"
                        } text-parchment`}
                    >
                        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                            <Shield className="w-5 h-5" />
                            Assessment Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="mb-3 md:mb-0">
                                <h3 className="font-semibold text-lg mb-1 text-gray-800">
                                    {isAssessmentComplete
                                        ? isVANPositive
                                            ? "VAN Positive: High Likelihood of LVO"
                                            : "VAN Negative"
                                        : "Assessment Incomplete"}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {isAssessmentComplete
                                        ? isVANPositive
                                            ? "Patient shows signs of both weakness and one or more VAN criteria."
                                            : weaknessPresent === false
                                            ? "No weakness present. VAN is negative."
                                            : "Weakness present, but no positive VAN criteria."
                                        : "Please complete all assessment steps."}
                                </p>

                                {isAssessmentComplete && isVANPositive && (
                                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-start">
                                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                                        <p className="text-xs text-gray-700">
                                            VAN positive result suggests high
                                            likelihood of Large Vessel Occlusion
                                            (LVO). Consider immediate vascular
                                            imaging and specialized
                                            intervention.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    Assessment Progress
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
                                                    isAssessmentComplete
                                                        ? isVANPositive
                                                            ? "text-critical-crimson"
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
                                                    (isStep1Complete
                                                        ? weaknessPresent ===
                                                          true
                                                            ? 100
                                                            : 100
                                                        : 50)) /
                                                    100
                                            }
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-bold text-gray-700">
                                            {isStep1Complete
                                                ? weaknessPresent === true
                                                    ? "2/2"
                                                    : "2/2"
                                                : "1/2"}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={resetAssessment}
                                    className="mt-2"
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
                            VAN Assessment Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 space-y-5">
                        <div className="flex items-center p-2.5 bg-blue-50/50 rounded-lg border border-blue-100/70">
                            <Info className="mr-2 h-4 w-4 text-blue-600" />
                            <p className="text-sm text-gray-600">
                                VAN is a two-step process. First, check for
                                weakness. If weakness is present, then assess
                                for vision, aphasia, and neglect.
                            </p>
                        </div>

                        {/* Step 1: Weakness Assessment */}
                        <div className="p-4 border border-gray-200 rounded-lg bg-white">
                            <h3 className="text-lg font-semibold text-deep-charcoal flex items-center mb-3">
                                <div className="w-7 h-7 bg-clinical-slate text-white rounded-full mr-2 flex items-center justify-center text-sm">
                                    1
                                </div>
                                Step 1: Motor Weakness Assessment
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 pl-9">
                                Check for weakness.
                            </p>

                            <RadioGroup
                                value={
                                    weaknessPresent !== null
                                        ? weaknessPresent.toString()
                                        : undefined
                                }
                                onValueChange={(val) => {
                                    setWeaknessPresent(val === "true");
                                    // If weakness is not present, reset VAN checks
                                    if (val === "false") {
                                        setCheckItems({
                                            vision: false,
                                            aphasia: false,
                                            neglect: false,
                                        });
                                    }
                                }}
                                className="pl-9"
                            >
                                <div className="space-y-3">
                                    <div
                                        className={`flex items-start p-3 rounded-md border transition-all ${
                                            weaknessPresent === false
                                                ? "bg-green-50/50 border-green-100 shadow-sm"
                                                : "hover:bg-gray-50/70 border-gray-100"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem
                                                value="false"
                                                id="weakness-no"
                                                className="mt-0"
                                            />
                                            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-sm flex-shrink-0">
                                                ✓
                                            </div>
                                            <Label
                                                htmlFor="weakness-no"
                                                className="text-sm leading-normal cursor-pointer"
                                            >
                                                No weakness present
                                            </Label>
                                        </div>
                                    </div>

                                    <div
                                        className={`flex items-start p-3 rounded-md border transition-all ${
                                            weaknessPresent === true
                                                ? "bg-amber-50/50 border-amber-100 shadow-sm"
                                                : "hover:bg-gray-50/70 border-gray-100"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem
                                                value="true"
                                                id="weakness-yes"
                                                className="mt-0"
                                            />
                                            <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-sm flex-shrink-0">
                                                !
                                            </div>
                                            <Label
                                                htmlFor="weakness-yes"
                                                className="text-sm leading-normal cursor-pointer"
                                            >
                                                Weakness present (face, arm, or
                                                leg)
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </RadioGroup>

                            {weaknessPresent === false && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md ml-9">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                        <span className="font-medium text-green-800">
                                            VAN Negative
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">
                                        Motor weakness is required for VAN
                                        assessment. Without weakness, the
                                        patient is VAN negative.
                                    </p>
                                </div>
                            )}

                            {weaknessPresent === true && (
                                <div className="mt-4 flex items-center justify-center">
                                    <div className="flex items-center text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">
                                            Proceed to Step 2
                                        </span>
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2: VAN Criteria */}
                        {weaknessPresent === true && (
                            <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                <h3 className="text-lg font-semibold text-deep-charcoal flex items-center mb-3">
                                    <div className="w-7 h-7 bg-clinical-slate text-white rounded-full mr-2 flex items-center justify-center text-sm">
                                        2
                                    </div>
                                    Step 2: Check for VAN Criteria
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 pl-9">
                                    Check if ANY of the following are present:
                                </p>

                                <div className="space-y-4 pl-9">
                                    {/* Vision */}
                                    <div
                                        className={`p-3 border rounded-md ${
                                            checkItems.vision
                                                ? "bg-red-50 border-red-200"
                                                : "bg-white border-gray-200"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="vision"
                                                checked={checkItems.vision}
                                                onCheckedChange={(checked) => {
                                                    setCheckItems((prev) => ({
                                                        ...prev,
                                                        vision:
                                                            checked === true,
                                                    }));
                                                }}
                                            />
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${
                                                    checkItems.vision
                                                        ? "bg-red-500"
                                                        : "bg-gray-400"
                                                }`}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor="vision"
                                                    className="text-base font-medium cursor-pointer"
                                                >
                                                    Vision
                                                </Label>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Field cut, double vision, or
                                                    blindness
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Aphasia */}
                                    <div
                                        className={`p-3 border rounded-md ${
                                            checkItems.aphasia
                                                ? "bg-red-50 border-red-200"
                                                : "bg-white border-gray-200"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="aphasia"
                                                checked={checkItems.aphasia}
                                                onCheckedChange={(checked) => {
                                                    setCheckItems((prev) => ({
                                                        ...prev,
                                                        aphasia:
                                                            checked === true,
                                                    }));
                                                }}
                                            />
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${
                                                    checkItems.aphasia
                                                        ? "bg-red-500"
                                                        : "bg-gray-400"
                                                }`}
                                            >
                                                <Brain className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor="aphasia"
                                                    className="text-base font-medium cursor-pointer"
                                                >
                                                    Aphasia
                                                </Label>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Trouble naming objects,
                                                    repeating sentences, or
                                                    following commands (not just
                                                    slurred speech)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Neglect */}
                                    <div
                                        className={`p-3 border rounded-md ${
                                            checkItems.neglect
                                                ? "bg-red-50 border-red-200"
                                                : "bg-white border-gray-200"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="neglect"
                                                checked={checkItems.neglect}
                                                onCheckedChange={(checked) => {
                                                    setCheckItems((prev) => ({
                                                        ...prev,
                                                        neglect:
                                                            checked === true,
                                                    }));
                                                }}
                                            />
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${
                                                    checkItems.neglect
                                                        ? "bg-red-500"
                                                        : "bg-gray-400"
                                                }`}
                                            >
                                                <div className="h-4 w-4 flex items-center justify-center">
                                                    N
                                                </div>
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor="neglect"
                                                    className="text-base font-medium cursor-pointer"
                                                >
                                                    Neglect
                                                </Label>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Ignoring one side, eyes/head
                                                    turned to one side, or not
                                                    feeling one side
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Assessment result based on VAN criteria */}
                                <div className="mt-6 p-4 rounded-lg border ml-9">
                                    <h4 className="font-medium text-lg mb-2 flex items-center">
                                        {isVANPositive ? (
                                            <>
                                                <XCircle className="w-5 h-5 mr-2 text-red-600" />
                                                <span className="text-red-800">
                                                    VAN Positive
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                                <span className="text-green-800">
                                                    VAN Negative
                                                </span>
                                            </>
                                        )}
                                    </h4>
                                    <p className="text-gray-700 mb-3">
                                        {isVANPositive
                                            ? "Weakness plus one or more VAN criteria detected. High likelihood of Large Vessel Occlusion."
                                            : "Weakness present, but no VAN criteria detected."}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <StatusItem
                                            title="Vision"
                                            description="Field cut, double vision, blindness"
                                            status={checkItems.vision}
                                        />
                                        <StatusItem
                                            title="Aphasia"
                                            description="Language problems"
                                            status={checkItems.aphasia}
                                        />
                                        <StatusItem
                                            title="Neglect"
                                            description="Inattention to one side"
                                            status={checkItems.neglect}
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-3">
                                        <Button
                                            onClick={generatePDF}
                                            variant="outline"
                                            className="flex items-center gap-2 w-full md:w-auto"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download PDF
                                        </Button>
                                        <Button
                                            onClick={resetAssessment}
                                            variant={
                                                isVANPositive
                                                    ? "destructive"
                                                    : "default"
                                            }
                                            className="w-full md:w-auto"
                                        >
                                            Reset Assessment
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

// StatusItem Component for VAN criteria
function StatusItem({
    title,
    description,
    status,
}: {
    title: string;
    description: string;
    status: boolean;
}) {
    return (
        <div
            className={`flex items-center p-2 rounded border ${
                status
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
            }`}
        >
            {status ? (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
            ) : (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            )}
            <div>
                <span className="text-sm font-medium text-gray-700">
                    {title}:{" "}
                </span>
                <span
                    className={`text-sm ${
                        status ? "text-red-700" : "text-green-700"
                    }`}
                >
                    {status ? "Present" : "Absent"}
                </span>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </div>
    );
}
