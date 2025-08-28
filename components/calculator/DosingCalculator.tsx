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

// Define the type for options in addTaggedText at the top level
interface TaggedTextOptions {
    tag?: string;
    fontSize?: number;
    fontStyle?: "normal" | "bold" | "italic";
    align?: "left" | "center" | "right";
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
    // Define font sizes
    const headerFontSize = 16;
    const sectionHeaderSize = 14;
    const baseFontSize = 12;
    const smallFontSize = 10;

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

        // Enhanced metadata - using only supported properties
        doc.setProperties({
            title: "Stroke Thrombolytic Dosing Card",
            subject:
                "Dosing instructions for Tenecteplase (TNK) or Alteplase (tPA)",
            author: "CodeStrokePro Calculator",
            keywords:
                "stroke, dosing, thrombolytic, TNK, tPA, calculator, accessible, medical",
            creator: "CodeStrokePro Calculator",
        });

        // Set document language (this helps with the natural language requirement)
        doc.setLanguage("en-US");

        const weight = parseFloat(patientWeight);
        const weightInKg = weightUnit === "lbs" ? weight * 0.454545 : weight;
        const drugName =
            selectedDrug === "tnk" ? "Tenecteplase (TNK)" : "Alteplase (tPA)";
        const currentDate = new Date().toLocaleString();

        // Font embedding - use standard fonts that are always embedded
        doc.setFont("helvetica", "normal");

        // Alternative: Load and embed custom font (requires font file)
        // doc.addFileToVFS('CustomFont.ttf', customFontBase64);
        // doc.addFont('CustomFont.ttf', 'CustomFont', 'normal');
        // doc.setFont('CustomFont');

        let yPos = 30;
        let tagId = 1; // For structure tagging

        // Function to add tagged content
        const addTaggedText = (
            text: string,
            x: number,
            y: number,
            options: TaggedTextOptions = {}
        ) => {
            const tag = options.tag || "P"; // Default to paragraph
            const fontSize = options.fontSize || 12;
            const fontStyle = options.fontStyle || "normal";

            doc.setFontSize(fontSize);
            doc.setFont("helvetica", fontStyle);

            // Add text without unsupported advancedAPI calls
            doc.text(text, x, y, options.align ? { align: options.align } : {});
        };

        // Add document title with proper styling
        doc.setFillColor(44, 62, 80); // headerBgColor
        doc.rect(0, 0, 210, 30, "F");
        doc.setFontSize(headerFontSize);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("STROKE THROMBOLYTIC DOSING CARD", 105, 20, {
            align: "center",
        });

        // Reset text color for main content
        doc.setTextColor(26, 26, 26); // primaryColor
        yPos = 45;

        // Section 1: Drug Information with clear hierarchy
        doc.setFontSize(sectionHeaderSize);
        doc.setFont("helvetica", "bold");
        doc.text("DRUG INFORMATION", 15, yPos);
        yPos += 5;

        // Add visual separator line for structure
        doc.setDrawColor(200, 200, 200);
        doc.line(15, yPos, 195, yPos);
        yPos += 10;

        doc.setFontSize(baseFontSize);
        doc.setFont("helvetica", "normal");

        // Use consistent spacing and alignment
        const leftMargin = 20;
        const lineHeight = 8;

        doc.text(`Drug: ${drugName}`, leftMargin, yPos);
        yPos += lineHeight;
        doc.text(
            `Patient Weight: ${patientWeight} ${weightUnit} (${weightInKg.toFixed(
                1
            )} kg)`,
            leftMargin,
            yPos
        );
        yPos += lineHeight;
        doc.text(`Calculated: ${currentDate}`, leftMargin, yPos);
        yPos += 15;

        // Section 2: Dosing Instructions with improved structure
        doc.setFontSize(sectionHeaderSize);
        doc.setFont("helvetica", "bold");
        doc.text("DOSING INSTRUCTIONS", 15, yPos);
        yPos += 5;

        doc.setDrawColor(200, 200, 200);
        doc.line(15, yPos, 195, yPos);
        yPos += 10;

        doc.setFontSize(baseFontSize);
        doc.setFont("helvetica", "normal");

        // Use bullet points with proper spacing for better readability
        if (selectedDrug === "tnk") {
            doc.text(
                `• Total Dose: ${doseCalculation.totalDose.toFixed(1)} mg`,
                leftMargin,
                yPos
            );
            yPos += lineHeight;
            doc.text(
                `• Volume: ${doseCalculation.volume.toFixed(1)} mL`,
                leftMargin,
                yPos
            );
            yPos += lineHeight;
            doc.text(
                "• Administration: IV push over 5-10 seconds",
                leftMargin,
                yPos
            );
            yPos += 15;
        } else {
            doc.text(
                `• Total Dose: ${doseCalculation.totalDose.toFixed(1)} mg`,
                leftMargin,
                yPos
            );
            yPos += lineHeight;
            doc.text(
                `• Bolus (10%): ${doseCalculation.pushDose!.toFixed(
                    1
                )} mg (${doseCalculation.pushVolume!.toFixed(1)} mL)`,
                leftMargin,
                yPos
            );
            yPos += lineHeight;
            doc.text(
                `• Infusion (90%): ${doseCalculation.infusionDose!.toFixed(
                    1
                )} mg (${doseCalculation.infusionVolume!.toFixed(
                    1
                )} mL) over 60 minutes`,
                leftMargin,
                yPos
            );
            yPos += 15;
        }

        // Section 3: Waste Documentation
        doc.setFontSize(sectionHeaderSize);
        doc.setFont("helvetica", "bold");
        doc.text("WASTE DOCUMENTATION", 15, yPos);
        yPos += 5;

        doc.setDrawColor(200, 200, 200);
        doc.line(15, yPos, 195, yPos);
        yPos += 10;

        doc.setFontSize(baseFontSize);
        doc.setFont("helvetica", "normal");
        doc.text(
            `• Unused amount: ${doseCalculation.waste.toFixed(
                1
            )} mg (${doseCalculation.wasteVolume.toFixed(1)} mL)`,
            leftMargin,
            yPos
        );
        yPos += 15;

        // Warning section with high contrast and clear formatting
        const warningBoxHeight = 25;
        doc.setFillColor(192, 57, 43); // warningBgColor with better contrast
        doc.rect(15, yPos, 180, warningBoxHeight, "F");

        // White text on dark background for maximum contrast
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(sectionHeaderSize);
        doc.text("⚠ CRITICAL WARNING", 105, yPos + 8, { align: "center" });

        doc.setFontSize(baseFontSize);
        doc.text(
            "VERIFY ALL CALCULATIONS BEFORE ADMINISTRATION",
            105,
            yPos + 18,
            { align: "center" }
        );

        yPos += warningBoxHeight + 10;

        // Add instructions for accessibility (alternative text concept)
        doc.setTextColor(74, 74, 74); // secondaryTextColor
        doc.setFont("helvetica", "normal");
        doc.setFontSize(smallFontSize);
        doc.text(
            "Document Structure: Header, Drug Information, Dosing Instructions, Waste Documentation, Warning",
            15,
            yPos
        );
        yPos += 6;
        doc.text(
            "This document contains critical medical dosing information that requires verification.",
            15,
            yPos
        );
        yPos += 10;

        // Footer with proper contrast
        doc.setTextColor(74, 74, 74);
        doc.setFontSize(smallFontSize);
        doc.text("Generated by CodeStrokePro Calculator", 105, 280, {
            align: "center",
        });
        doc.text(
            `Page 1 of 1 - Generated: ${new Date().toLocaleDateString()}`,
            105,
            285,
            { align: "center" }
        );

        // Enhanced filename for better accessibility
        const timestamp = new Date().toISOString().split("T")[0];
        const accessibleFilename = `stroke-dosing-card-${drugName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")}-${timestamp}.pdf`;

        // Save the PDF
        doc.save(accessibleFilename);
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
                            name="weight-unit" // links the select to the label
                            value={weightUnit}
                            onValueChange={onWeightUnitChange}
                            aria-label="Weight Unit" // fallback label for screen readers
                        >
                            <SelectTrigger
                                id="weight-unit-trigger"
                                className="text-base p-3 border-2 border-harbor-gray focus:border-vital-green"
                                aria-haspopup="listbox" // indicates a dropdown
                                aria-expanded="false" // will automatically update if your Select handles state
                                name="weight-unit-trigger"
                                aria-labelledby="weight-unit-label"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg" aria-label="Kilograms">
                                    Kilograms (kg)
                                </SelectItem>
                                <SelectItem value="lbs" aria-label="Pounds">
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
                                name="download-pdf"
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
                            name="back-to-drug-selection"
                        >
                            Back to Drug Selection
                        </Button>
                    )}
                    {additionalResources && (
                        <Button
                            onClick={onShowResources}
                            variant="outline"
                            className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg border-clin text-clin hover:bg-clin/10 flex items-center justify-center text-center whitespace-normal break-words"
                            name="post-thrombolytic-resources"
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
                            name="start-new-session"
                        >
                            Start New Session
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
