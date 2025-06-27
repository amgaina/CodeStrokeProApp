"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, AlertTriangle, Download } from "lucide-react";

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

interface DosingCalculatorProps {
    selectedDrug: "tnk" | "alteplase";
    patientWeight: string;
    weightUnit: "kg" | "lbs";
    vialSize: string;
    onWeightChange: (weight: string) => void;
    onWeightUnitChange: (unit: "kg" | "lbs") => void;
    onVialSizeChange: (size: string) => void;
    onNext: () => void;
    onBack?: () => void;
}

export default function DosingCalculator({
    selectedDrug,
    patientWeight,
    weightUnit,
    vialSize,
    onWeightChange,
    onWeightUnitChange,
    onVialSizeChange,
    onNext,
    onBack,
}: DosingCalculatorProps) {
    const calculateDose = (): DoseCalculation | null => {
        const weight = parseFloat(patientWeight);
        const vial = parseFloat(vialSize);

        if (!weight || !vial || weight <= 0 || vial <= 0) return null;

        // Convert weight to kg if in lbs
        const weightInKg = weightUnit === "lbs" ? weight * 0.453592 : weight;

        // Validate reasonable weight range (5-300 kg)
        if (weightInKg < 5 || weightInKg > 300) return null;

        if (selectedDrug === "tnk") {
            // TNK: 0.25 mg/kg, max 25 mg
            const totalDose = Math.min(weightInKg * 0.25, 25);
            // TNK is reconstituted to 5 mg/mL (50mg in 10mL)
            const volume = totalDose / 5; // 5 mg/mL concentration
            const waste = Math.max(0, vial - totalDose);
            const wasteVolume = waste / 5; // Also in 5 mg/mL concentration

            return {
                totalDose,
                volume,
                waste,
                wasteVolume,
            };
        } else {
            // Alteplase: 0.9 mg/kg, max 90 mg
            const totalDose = Math.min(weightInKg * 0.9, 90);
            const pushDose = totalDose * 0.1; // 10% bolus
            const infusionDose = totalDose * 0.9; // 90% infusion
            const volume = totalDose; // 1 mg/mL concentration
            const pushVolume = pushDose;
            const infusionVolume = infusionDose;
            const waste = Math.max(0, vial - totalDose);
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

    const generateDosingCard = () => {
        if (!doseCalculation) return;

        const weight = parseFloat(patientWeight);
        const weightInKg = weightUnit === "lbs" ? weight * 0.453592 : weight;

        const content = `
STROKE THROMBOLYTIC DOSING CARD
================================
Drug: ${selectedDrug === "tnk" ? "Tenecteplase (TNK)" : "Alteplase (tPA)"}
Patient Weight: ${patientWeight} ${weightUnit} (${weightInKg.toFixed(1)} kg)
Calculated: ${new Date().toLocaleString()}

DOSING INSTRUCTIONS:
${selectedDrug === "tnk" 
    ? `- Total Dose: ${doseCalculation.totalDose.toFixed(1)} mg
- Volume: ${doseCalculation.volume.toFixed(1)} mL
- Administration: IV push over 5-10 seconds`
    : `- Total Dose: ${doseCalculation.totalDose.toFixed(1)} mg
- Bolus (10%): ${doseCalculation.pushDose!.toFixed(1)} mg (${doseCalculation.pushVolume!.toFixed(1)} mL)
- Infusion (90%): ${doseCalculation.infusionDose!.toFixed(1)} mg (${doseCalculation.infusionVolume!.toFixed(1)} mL) over 60 minutes`
}

WASTE: ${doseCalculation.waste.toFixed(1)} mg (${doseCalculation.wasteVolume.toFixed(1)} mL)

⚠️  VERIFY ALL CALCULATIONS BEFORE ADMINISTRATION
        `;

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stroke-dosing-${selectedDrug}-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="mb-6 md:mb-8 shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                    <Calculator className="w-5 h-5 md:w-6 md:h-6" />
                    {selectedDrug === "tnk" ? "Tenecteplase" : "Alteplase"} Dosing Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                {/* Weight Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="weight" className="text-sm font-medium text-gray-700 block mb-2">
                            Patient Weight
                        </Label>
                        <Input
                            id="weight"
                            type="number"
                            placeholder="Enter weight"
                            value={patientWeight}
                            onChange={(e) => onWeightChange(e.target.value)}
                            min="1"
                            max={weightUnit === "kg" ? "300" : "660"}
                            step="0.1"
                            className="text-base p-3 border-2 border-gray-300 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="weight-unit" className="text-sm font-medium text-gray-700 block mb-2">
                            Weight Unit
                        </Label>
                        <Select value={weightUnit} onValueChange={onWeightUnitChange}>
                            <SelectTrigger className="text-base p-3 border-2 border-gray-300 focus:border-green-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Vial Size Input */}
                <div>
                    <Label htmlFor="vial-size" className="text-sm font-medium text-gray-700 block mb-2">
                        Available Vial Size (mg)
                    </Label>
                    <Select value={vialSize} onValueChange={onVialSizeChange}>
                        <SelectTrigger className="text-base p-3 border-2 border-gray-300 focus:border-green-500">
                            <SelectValue placeholder="Select vial size" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedDrug === "tnk" ? (
                                <>
                                    <SelectItem value="50">50 mg vial</SelectItem>
                                </>
                            ) : (
                                <>
                                    <SelectItem value="50">50 mg vial</SelectItem>
                                    <SelectItem value="100">100 mg vial</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Dose Calculation Results */}
                {doseCalculation && (
                    <div className="space-y-4">
                        <Alert className="border-green-200 bg-green-50">
                            <Calculator className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                <strong>Dosing calculated successfully.</strong> Please verify all calculations before administration.
                            </AlertDescription>
                        </Alert>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">
                                Calculated Dosing Instructions
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h5 className="font-semibold text-blue-800 mb-2">Patient Information</h5>
                                    <p className="text-sm text-blue-700">
                                        Weight: {patientWeight} {weightUnit} 
                                        {weightUnit === "lbs" && ` (${(parseFloat(patientWeight) * 0.453592).toFixed(1)} kg)`}
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        Drug: {selectedDrug === "tnk" ? "Tenecteplase (TNK)" : "Alteplase (tPA)"}
                                    </p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h5 className="font-semibold text-green-800 mb-2">Total Dose</h5>
                                    <p className="text-2xl font-bold text-green-800">
                                        {doseCalculation.totalDose.toFixed(1)} mg
                                    </p>
                                    <p className="text-sm text-green-700">
                                        Volume: {doseCalculation.volume.toFixed(1)} mL
                                    </p>
                                </div>
                            </div>

                            {selectedDrug === "alteplase" && doseCalculation.pushDose && (
                                <div className="space-y-3 mb-4">
                                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                        <h5 className="font-semibold text-orange-800 mb-2">
                                            Step 1: IV Bolus (10%)
                                        </h5>
                                        <p className="text-lg font-bold text-orange-800">
                                            {doseCalculation.pushDose.toFixed(1)} mg ({doseCalculation.pushVolume!.toFixed(1)} mL)
                                        </p>
                                        <p className="text-sm text-orange-700">
                                            Administer over 1-2 minutes
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                        <h5 className="font-semibold text-purple-800 mb-2">
                                            Step 2: IV Infusion (90%)
                                        </h5>
                                        <p className="text-lg font-bold text-purple-800">
                                            {doseCalculation.infusionDose!.toFixed(1)} mg ({doseCalculation.infusionVolume!.toFixed(1)} mL)
                                        </p>
                                        <p className="text-sm text-purple-700">
                                            Infuse over 60 minutes
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedDrug === "tnk" && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                                    <h5 className="font-semibold text-green-800 mb-2">
                                        Administration Instructions
                                    </h5>
                                    <p className="text-sm text-green-700">
                                        • Administer as IV push over 5-10 seconds
                                    </p>
                                    <p className="text-sm text-green-700">
                                        • Flush IV line with normal saline after administration
                                    </p>
                                </div>
                            )}

                            {doseCalculation.waste > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h5 className="font-semibold text-gray-800 mb-2">Drug Waste</h5>
                                    <p className="text-sm text-gray-700">
                                        Unused: {doseCalculation.waste.toFixed(1)} mg ({doseCalculation.wasteVolume.toFixed(1)} mL)
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Document waste according to institutional policy
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Download Dosing Card */}
                        <div className="flex justify-center">
                            <Button
                                onClick={generateDosingCard}
                                variant="outline"
                                className="border-green-500 text-green-600 hover:bg-green-50"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Dosing Card
                            </Button>
                        </div>
                    </div>
                )}

                {/* Safety Warning */}
                <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 text-sm">
                        <strong>Safety Check:</strong> Always verify dosing calculations with a second clinician 
                        before administration. This tool is for clinical decision support only.
                    </AlertDescription>
                </Alert>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    {onBack && (
                        <Button
                            onClick={onBack}
                            variant="outline"
                            className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                        >
                            Back to Drug Selection
                        </Button>
                    )}
                    <Button
                        onClick={onNext}
                        className="bg-green-600 hover:bg-green-700 text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                        disabled={!doseCalculation}
                    >
                        Continue to Resources
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
