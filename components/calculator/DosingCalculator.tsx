"use client";

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
import { jsPDF } from "jspdf";

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
    isQuickCalc?: boolean;
    onWeightChange: (weight: string) => void;
    onWeightUnitChange: (unit: "kg" | "lbs") => void;
    onVialSizeChange: (size: string) => void;
    onRestart?: () => void;
    onShowResources?: () => void;
    onBack?: () => void;
    additionalResources?: boolean;
}

export default function DosingCalculator({
    selectedDrug,
    patientWeight,
    weightUnit,
    vialSize,
    onWeightChange,
    onWeightUnitChange,
    onVialSizeChange,
    onRestart,
    isQuickCalc = false,
    onShowResources,
    onBack,
    additionalResources,
}: DosingCalculatorProps) {
    const calculateDose = (): DoseCalculation | null => {
        const weight = parseFloat(patientWeight);
        const vial = parseFloat(vialSize);

        if (!weight || !vial || weight <= 0 || vial <= 0) return null;

        // Convert weight to kg if in lbs
        const weightInKg = weightUnit === "lbs" ? weight * 0.453592 : weight;

        // Validate reasonable weight range (5-300 kg)
        if (weightInKg < 5 || weightInKg > 300) return null;

        function getTnkDose(weightInKg: number): {
            totalDose: number;
            volume: number;
        } {
            if (weightInKg < 60) return { totalDose: 15, volume: 3.0 };
            if (weightInKg < 70) return { totalDose: 17.5, volume: 3.5 };
            if (weightInKg < 80) return { totalDose: 20, volume: 4.0 };
            if (weightInKg < 90) return { totalDose: 22.5, volume: 4.5 };
            /* ≥90 kg */
            return { totalDose: 25, volume: 5.0 };
        }

        if (selectedDrug === "tnk") {
            const { totalDose, volume } = getTnkDose(weightInKg);
            const waste = Math.max(0, vial - totalDose);
            const wasteVolume = waste / 5;

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

    const generatePdfDosingCard = () => {
        if (!doseCalculation) return;

        const doc = new jsPDF();
        const primaryColor = '#2E3A40';
        const secondaryColor = '#4A90E2';
        const accentColor = '#E74C3C';

        const weight = parseFloat(patientWeight);
        const weightInKg = weightUnit === "lbs" ? weight * 0.454545 : weight;
        const drugName = selectedDrug === "tnk" ? "Tenecteplase (TNK)" : "Alteplase (tPA)";
        const currentDate = new Date().toLocaleString();

        // Add header
        doc.setFillColor(46, 58, 64); // #2E3A40
        doc.rect(0, 0, 210, 30, 'F');
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text('STROKE THROMBOLYTIC DOSING CARD', 105, 20, { align: 'center' });

        // Add drug info section
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('DRUG INFORMATION', 15, 45);
        doc.setFont('helvetica', 'normal');
        doc.text(`Drug: ${drugName}`, 15, 55);
        doc.text(`Patient Weight: ${patientWeight} ${weightUnit} (${weightInKg.toFixed(1)} kg)`, 15, 65);
        doc.text(`Calculated: ${currentDate}`, 15, 75);

        // Add dosing instructions section
        doc.setFont('helvetica', 'bold');
        doc.text('DOSING INSTRUCTIONS', 15, 90);
        doc.setFont('helvetica', 'normal');

        let yPos = 100;
        if (selectedDrug === "tnk") {
            doc.text(`- Total Dose: ${doseCalculation.totalDose.toFixed(1)} mg`, 20, yPos);
            yPos += 10;
            doc.text(`- Volume: ${doseCalculation.volume.toFixed(1)} mL`, 20, yPos);
            yPos += 10;
            doc.text('- Administration: IV push over 5-10 seconds', 20, yPos);
            yPos += 15;
        } else {
            doc.text(`- Total Dose: ${doseCalculation.totalDose.toFixed(1)} mg`, 20, yPos);
            yPos += 10;
            doc.text(`- Bolus (10%): ${doseCalculation.pushDose!.toFixed(1)} mg (${doseCalculation.pushVolume!.toFixed(1)} mL)`, 20, yPos);
            yPos += 10;
            doc.text(`- Infusion (90%): ${doseCalculation.infusionDose!.toFixed(1)} mg (${doseCalculation.infusionVolume!.toFixed(1)} mL) over 60 minutes`, 20, yPos);
            yPos += 15;
        }

        // Add waste information
        doc.setFont('helvetica', 'bold');
        doc.text('WASTE DOCUMENTATION', 15, yPos);
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.text(`${doseCalculation.waste.toFixed(1)} mg (${doseCalculation.wasteVolume.toFixed(1)} mL unused)`, 20, yPos);
        yPos += 15;

        // Add warning section
        doc.setFillColor(231, 76, 60); // #E74C3C
        doc.rect(15, yPos, 180, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('VERIFY ALL CALCULATIONS BEFORE ADMINISTRATION', 105, yPos + 12, { align: 'center' });
        yPos += 30;

        // Add footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('This document is generated by CodeStrokePro Calculator', 105, 285, { align: 'center' });

        // Save the PDF
        doc.save(`stroke-dosing-${selectedDrug}-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <Card className="mb-6 md:mb-8 shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r bg-clinical-slate/90 text-white p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                    <Calculator className="w-5 h-5 md:w-6 md:h-6" />
                    {selectedDrug === "tnk" ? "Tenecteplase" : "Alteplase"}{" "}
                    Dosing Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                {/* Weight Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label
                            htmlFor="weight"
                            className="text-sm font-medium text-deep-charcoal block mb-2"
                        >
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
                            className="text-base p-3 border-2 border-harbor-gray focus:border-clin"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="weight-unit"
                            className="text-sm font-medium text-deep-charcoal block mb-2"
                        >
                            Weight Unit
                        </Label>
                        <Select
                            value={weightUnit}
                            onValueChange={onWeightUnitChange}
                        >
                            <SelectTrigger className="text-base p-3 border-2 border-harbor-gray focus:border-vital-green">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg">
                                    Kilograms (kg)
                                </SelectItem>
                                <SelectItem value="lbs">
                                    Pounds (lbs)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* Vial Size Input */}
                <div>
                    <Label
                        htmlFor="vial-size"
                        className="text-sm font-medium text-deep-charcoal block mb-2"
                    >
                        Available Vial Size (mg)
                    </Label>
                    <Select value={vialSize} onValueChange={onVialSizeChange}>
                        <SelectTrigger className="text-base p-3 border-2 border-harbor-gray focus:border-vital-green">
                            <SelectValue placeholder="Select vial size" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedDrug === "tnk" ? (
                                <>
                                    <SelectContent>
                                        {/* TNK vials – give each a distinct value */}
                                        <SelectItem value="25">
                                            25 mg vial
                                        </SelectItem>
                                        <SelectItem value="50">
                                            50 mg vial
                                        </SelectItem>
                                    </SelectContent>
                                </>
                            ) : (
                                <>
                                    <SelectContent>
                                        {/* Alteplase vials – give each a distinct value */}
                                        <SelectItem value="50">
                                            50 mg vial
                                        </SelectItem>
                                        <SelectItem value="100">
                                            100 mg vial
                                        </SelectItem>
                                    </SelectContent>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                {/* Dose Calculation Results */}
                {doseCalculation && (
                    <div className="space-y-6">
                        {/* Success Alert */}
                        <Alert className="border-vital-green bg-vital-green/10 border-2">
                            <Calculator className="h-5 w-5 text-vital-green" />
                            <AlertDescription className="text-clin font-medium text-base">
                                <strong>
                                    ✓ Dosing calculated successfully.
                                </strong>{" "}
                                Review all information before administration.
                            </AlertDescription>
                        </Alert>

                        {/* Main Dosing Information - Logical and Clear */}
                        <div className="bg-white border-2 border-clinical-slate/20 rounded-lg p-6 shadow-lg">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-clinical-slate mb-2">
                                    Dosing Instructions
                                </h3>
                                <div className="h-0.5 w-24 bg-clin mx-auto rounded-full"></div>
                            </div>

                            {/* Critical Information Cards */}
                            <div className="space-y-4">
                                {/* Patient & Drug Info - Clean Layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="bg-clinical-slate/5 border border-clinical-slate/20 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-clinical-slate mb-2 uppercase tracking-wide">
                                            Patient Information
                                        </h4>
                                        <div className="space-y-1">
                                            <p className="text-lg font-bold text-deep-charcoal">
                                                {patientWeight} {weightUnit}
                                                {weightUnit === "lbs" && (
                                                    <span className="text-sm font-medium text-deep-charcoal/70 ml-2">
                                                        (
                                                        {(
                                                            parseFloat(
                                                                patientWeight
                                                            ) * 0.453592
                                                        ).toFixed(1)}{" "}
                                                        kg)
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-deep-charcoal/80">
                                                Drug:{" "}
                                                {selectedDrug === "tnk"
                                                    ? "Tenecteplase (TNK)"
                                                    : "Alteplase (tPA)"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-clin/5 border border-clin/20 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-clin mb-2 uppercase tracking-wide">
                                            Total Dose Required
                                        </h4>
                                        <p className="text-2xl font-bold text-deep-charcoal mb-1">
                                            {doseCalculation.totalDose.toFixed(
                                                1
                                            )}{" "}
                                            mg
                                        </p>
                                        <p className="text-sm text-deep-charcoal/80">
                                            Volume:{" "}
                                            {doseCalculation.volume.toFixed(1)}{" "}
                                            mL
                                        </p>
                                    </div>
                                </div>

                                {/* Administration Steps - Logical Size */}
                                {selectedDrug === "alteplase" &&
                                    doseCalculation.pushDose && (
                                        <div className="space-y-3">
                                            <h4 className="text-lg font-semibold text-deep-charcoal text-center mb-3">
                                                Administration Steps
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* Step 1 - Bolus */}
                                                <div className="bg-urgent-amber/10 border-2 border-urgent-amber/30 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <div className="bg-urgent-amber text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm mr-2">
                                                            1
                                                        </div>
                                                        <h5 className="text-sm font-semibold text-deep-charcoal uppercase">
                                                            IV Bolus (10%)
                                                        </h5>
                                                    </div>
                                                    <p className="text-xl font-bold text-deep-charcoal mb-1">
                                                        {doseCalculation.pushDose.toFixed(
                                                            1
                                                        )}{" "}
                                                        mg
                                                    </p>
                                                    <p className="text-sm text-deep-charcoal/80 mb-2">
                                                        Volume:{" "}
                                                        {doseCalculation.pushVolume!.toFixed(
                                                            1
                                                        )}{" "}
                                                        mL
                                                    </p>
                                                    <p className="text-sm font-medium text-urgent-amber bg-urgent-amber/20 px-2 py-1 rounded">
                                                        ⏱️ Give over 1 minute
                                                    </p>
                                                </div>

                                                {/* Step 2 - Infusion */}
                                                <div className="bg-clinical-slate/10 border-2 border-clinical-slate/30 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <div className="bg-clinical-slate text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm mr-2">
                                                            2
                                                        </div>
                                                        <h5 className="text-sm font-semibold text-deep-charcoal uppercase">
                                                            IV Infusion (90%)
                                                        </h5>
                                                    </div>
                                                    <p className="text-xl font-bold text-deep-charcoal mb-1">
                                                        {doseCalculation.infusionDose!.toFixed(
                                                            1
                                                        )}{" "}
                                                        mg
                                                    </p>
                                                    <p className="text-sm text-deep-charcoal/80 mb-2">
                                                        Volume:{" "}
                                                        {doseCalculation.infusionVolume!.toFixed(
                                                            1
                                                        )}{" "}
                                                        mL
                                                    </p>
                                                    <p className="text-sm font-medium text-clinical-slate bg-clinical-slate/20 px-2 py-1 rounded">
                                                        ⏱️ Infuse over 60
                                                        minutes
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* Drug Waste Information */}
                                {doseCalculation.waste > 0 && (
                                    <div className="bg-harbor-gray/10 border border-harbor-gray/30 p-4 rounded-lg">
                                        <h5 className="text-sm font-semibold text-deep-charcoal mb-2 uppercase tracking-wide">
                                            📋 Drug Waste Documentation
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-lg font-bold text-deep-charcoal">
                                                    {doseCalculation.waste.toFixed(
                                                        1
                                                    )}{" "}
                                                    mg
                                                </p>
                                                <p className="text-sm text-deep-charcoal/70">
                                                    (
                                                    {doseCalculation.wasteVolume.toFixed(
                                                        1
                                                    )}{" "}
                                                    mL unused)
                                                </p>
                                            </div>
                                            <div className="text-xs text-deep-charcoal/70">
                                                <p className="font-medium">
                                                    ⚠️ Document waste per
                                                    institutional policy
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Safety Warning */}
                        <Alert className="border-critical-crimson bg-critical-crimson/10 border-2 shadow-md">
                            <AlertDescription className="text-deep-charcoal">
                                <div className="space-y-2">
                                    <p className="text-base font-semibold">
                                        ⚠️ Critical Safety Check Required
                                    </p>
                                    <div className="text-sm space-y-1">
                                        <p>
                                            ✓ Always verify dosing calculations
                                            with a second clinician
                                        </p>
                                        <p>
                                            ✓ Confirm patient weight and drug
                                            selection
                                        </p>
                                        <p>
                                            ✓ Check for contraindications before
                                            administration
                                        </p>
                                        <p>
                                            ✓ This tool is for clinical decision
                                            support only
                                        </p>
                                    </div>
                                </div>
                            </AlertDescription>
                        </Alert>

                        {/* Download Options */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={generatePdfDosingCard}
                                className="bg-[#2E3A40] text-white hover:bg-[#2E3A40]/90 px-6 py-2"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF Version
                            </Button>
                        </div>
                    </div>
                )}
                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
                    {onBack && (
                        <Button
                            onClick={onBack}
                            variant="outline"
                            className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                        >
                            Back to Drug Selection
                        </Button>
                    )}
                    {additionalResources && (
                        <Button
                            onClick={onShowResources}
                            variant="outline"
                            className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg border-clin text-clin hover:bg-clin/10 flex items-center justify-center text-center whitespace-normal break-words"
                        >
                            <span className="block text-center leading-snug">
                                Post-Thrombolytic Monitoring &amp; Additional
                                Resources
                            </span>
                        </Button>
                    )}
                    {doseCalculation && !isQuickCalc && (
                        <Button
                            onClick={onRestart}
                            variant="destructive"
                            className="bg-critical-crimson text-white hover:bg-critical-crimson/90 text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                        >
                            Start New Session
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}