"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Check, FileText } from "lucide-react";

interface NIHSSScoreProps {
    totalScore: number;
    severity: {
        label: string;
        color: string;
    };
    isComplete: boolean;
    showReset?: boolean;
    onReset?: () => void;
    progress?: number;
    completedQuestions?: number;
    totalQuestions?: number;
    // Add download PDF functionality
    onDownloadPdf?: () => void;
}

export default function NIHSSScore({
    totalScore,
    severity,
    isComplete,
    showReset = false,
    onReset,
    progress = 0,
    completedQuestions = 0,
    totalQuestions = 11,
    onDownloadPdf,
}: NIHSSScoreProps) {
    // Map color string to actual color class
    const getColorClass = (colorName: string) => {
        const colorMap: Record<string, string> = {
            "vital-green": "bg-vital-green text-white",
            "urgent-amber": "bg-urgent-amber text-deep-charcoal",
            "critical-crimson": "bg-critical-crimson text-white",
            "harbor-gray": "bg-harbor-gray text-deep-charcoal",
        };

        return colorMap[colorName] || "bg-harbor-gray text-deep-charcoal";
    };

    return (
        <Card className="mb-6 clarity-shadow border-2 border-clinical-slate/70 bg-white overflow-hidden">
            <div
                className={`h-2 w-full ${
                    severity.color === "vital-green"
                        ? "bg-vital-green"
                        : severity.color === "urgent-amber"
                        ? "bg-urgent-amber"
                        : severity.color === "critical-crimson"
                        ? "bg-critical-crimson"
                        : "bg-harbor-gray"
                }`}
            ></div>
            <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div
                            className={`p-3 rounded-full ${
                                !isComplete
                                    ? "bg-urgent-amber/10"
                                    : severity.color === "vital-green"
                                    ? "bg-vital-green/10"
                                    : severity.color === "urgent-amber"
                                    ? "bg-urgent-amber/10"
                                    : severity.color === "critical-crimson"
                                    ? "bg-critical-crimson/10"
                                    : "bg-harbor-gray/10"
                            }`}
                        >
                            {!isComplete ? (
                                <AlertTriangle className="h-6 w-6 text-urgent-amber" />
                            ) : (
                                <Check className="h-6 w-6 text-vital-green" />
                            )}
                        </div>

                        <div className="text-center md:text-left">
                            <h3 className="text-base font-medium text-gray-700">
                                {isComplete
                                    ? "NIH Stroke Scale Score"
                                    : "Assessment Incomplete"}
                            </h3>
                            <div className="flex items-center mt-1 gap-3">
                                <div className="result-score text-4xl md:text-5xl font-bold text-deep-charcoal">
                                    {totalScore}
                                </div>
                                <div
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${getColorClass(
                                        severity.color
                                    )}`}
                                >
                                    {severity.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <span>
                                {completedQuestions} of {totalQuestions}{" "}
                                complete
                            </span>
                            <span className="font-medium">
                                ({Math.round(progress)}%)
                            </span>
                        </div>
                        <div className="w-full md:w-48 h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 rounded-full transition-all duration-300 ease-in-out"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor:
                                        severity.color === "vital-green"
                                            ? "var(--vital-green)"
                                            : severity.color === "urgent-amber"
                                            ? "var(--urgent-amber)"
                                            : severity.color ===
                                              "critical-crimson"
                                            ? "var(--critical-crimson)"
                                            : "var(--clinical-slate)",
                                }}
                            />
                        </div>

                        <div className="flex gap-2 mt-2">
                            {showReset && onReset && (
                                <Button
                                    variant="outline"
                                    onClick={onReset}
                                    className="flex items-center gap-2 border-2"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    Reset Assessment
                                </Button>
                            )}

                            {onDownloadPdf && (
                                <Button
                                    onClick={onDownloadPdf}
                                    variant="outline"
                                    className="flex items-center gap-2 border-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    Download PDF Report
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="p-2 rounded bg-vital-green/10 border border-vital-green/20">
                        <div className="font-medium text-vital-green">1–4</div>
                        <div className="text-gray-600">Minor stroke</div>
                    </div>
                    <div className="p-2 rounded bg-urgent-amber/10 border border-urgent-amber/20">
                        <div className="font-medium text-urgent-amber">
                            5–15
                        </div>
                        <div className="text-gray-600">Moderate stroke</div>
                    </div>
                    <div className="p-2 rounded bg-urgent-amber/10 border border-urgent-amber/20">
                        <div className="font-medium text-urgent-amber">
                            16–20
                        </div>
                        <div className="text-gray-600">Moderate–severe</div>
                    </div>
                    <div className="p-2 rounded bg-critical-crimson/10 border border-critical-crimson/20">
                        <div className="font-medium text-critical-crimson">
                            21–42
                        </div>
                        <div className="text-gray-600">Severe stroke</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
