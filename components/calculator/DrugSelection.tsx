"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Info, CheckCircle } from "lucide-react";

interface DrugSelectionProps {
    selectedDrug: "tnk" | "alteplase" | null;
    onDrugSelect: (drug: "tnk" | "alteplase") => void;
    onNext: () => void;
    onBack?: () => void;
}

export default function DrugSelection({
    selectedDrug,
    onDrugSelect,
    onNext,
    onBack,
}: DrugSelectionProps) {
    return (
        <Card className="mb-6 md:mb-8 shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r bg-clinical-slate/90 text-white p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                    <Stethoscope className="w-5 h-5 md:w-6 md:h-6" />
                    Thrombolytic Drug Selection
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
                <div className="space-y-4 md:space-y-6">
                    <div className="text-center">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                            Select Thrombolytic Agent
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Both agents are guideline-recommended for acute
                            ischemic stroke
                        </p>
                    </div>
                    {/* Drug Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* TNK Card */}
                        <div
                            className={`relative border-2 rounded-xl p-4 md:p-6 cursor-pointer transition-all duration-300 ${selectedDrug === "tnk"
                                ? "border-purple-500 bg-purple-50 shadow-lg transform scale-105"
                                : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                                }`}
                            onClick={() => onDrugSelect("tnk")}
                        >
                            {selectedDrug === "tnk" && (
                                <div className="absolute -top-2 -right-2">
                                    <div className="bg-purple-500 text-white rounded-full p-1">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                </div>
                            )}

                            <div className="text-center">
                                <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                                    Tenecteplase (TNK)
                                </h4>
                                <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-300">
                                    Single IV Bolus
                                </Badge>

                                <div className="space-y-3 text-sm text-gray-700">

                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <h5 className="font-semibold text-blue-800 mb-1">
                                            Dosing
                                        </h5>
                                        <p className="text-xs">
                                            Dose by weight range
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alteplase Card */}
                        <div
                            className={`relative border-2 rounded-xl p-4 md:p-6 cursor-pointer transition-all duration-300 ${selectedDrug === "alteplase"
                                ? "border-blue-500 bg-blue-50 shadow-lg transform scale-105"
                                : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                                }`}
                            onClick={() => onDrugSelect("alteplase")}
                        >
                            {selectedDrug === "alteplase" && (
                                <div className="absolute -top-2 -right-2">
                                    <div className="bg-blue-500 text-white rounded-full p-1">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                </div>
                            )}

                            <div className="text-center">
                                <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                                    Alteplase (tPA)
                                </h4>
                                <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
                                    IV Bolus + Infusion
                                </Badge>

                                <div className="space-y-3 text-sm text-gray-700">

                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <h5 className="font-semibold text-blue-800 mb-1">
                                            Dosing
                                        </h5>
                                        <p className="text-xs">
                                            0.9 mg/kg (max 90 mg)
                                        </p>
                                        <p className="text-xs">
                                            10% bolus over 1 min + 90% over 60 min
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selection Confirmation */}
                    {selectedDrug && (
                        <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium">
                                ✓ Selected:{" "}
                                {selectedDrug === "tnk"
                                    ? "Tenecteplase (TNK)"
                                    : "Alteplase (tPA)"}
                            </p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        {onBack && (
                            <Button
                                onClick={onBack}
                                variant="outline"
                                className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                            >
                                Back to Screening
                            </Button>
                        )}
                        <Button
                            onClick={onNext}
                            className="bg-clinical-slate hover:bg-clinical-slate/90 text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                            disabled={!selectedDrug}
                        >
                            Continue to Dosing Calculator
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
