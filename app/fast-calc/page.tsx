"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft } from "lucide-react";
import DrugSelection from "@/components/calculator/DrugSelection";
import DosingCalculator from "@/components/calculator/DosingCalculator";

export default function QuickCalculator() {
    const [selectedDrug, setSelectedDrug] = useState<
        "tnk" | "alteplase" | null
    >(null);
    const [vialSize, setVialSize] = useState("");
    const [ptWeight, setPtWeight] = useState("");
    const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
    const [currentStep, setCurrentStep] = useState<"selection" | "dosing">(
        "selection"
    );

    const handleDrugSelect = (drug: "tnk" | "alteplase" | null) => {
        setSelectedDrug(drug);
        setCurrentStep("dosing");
    };

    const handleBackFromDosing = () => {
        setCurrentStep("selection");
    };

    // Animation variants
    const stepVariants = {
        enter: { opacity: 0, x: 50 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <div className="min-h-screen bg-parchment">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-harbor-gray bg-clinical-slate text-white backdrop-blur-sm py-3 shadow-sm">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl md:text-2xl font-medium flex items-center">
                            <Calculator className="mr-2 h-5 w-5" />
                            Quick Dosage Calculator
                        </h1>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/90 hover:text-white hover:bg-white/10"
                            onClick={() => window.history.back()}
                            name="back-button"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
                {/* Page title before card */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-semibold text-deep-charcoal">
                        Quick Dosage Calculator
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Quickly calculate weight-based thrombolytic dosing
                        without the full workflow
                    </p>
                </div>

                <Card className="mx-auto bg-white shadow-sm border border-gray-200">
                    {/* Step indicator */}
                    <div className="px-4 md:px-6 pt-6">
                        <div className="flex items-center justify-center mb-6">
                            <div className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                        currentStep === "selection"
                                            ? "bg-clinical-slate text-white"
                                            : "bg-blue-100 text-clinical-slate"
                                    } transition-colors`}
                                >
                                    1
                                </div>
                                <div
                                    className={`w-16 h-1 ${
                                        currentStep === "selection"
                                            ? "bg-blue-100"
                                            : "bg-clinical-slate"
                                    } transition-colors`}
                                ></div>
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                        currentStep === "dosing"
                                            ? "bg-clinical-slate text-white"
                                            : "bg-blue-100 text-blue-600"
                                    } transition-colors`}
                                >
                                    2
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-deep-charcoal mb-2 text-center">
                            {currentStep === "selection"
                                ? "Select Thrombolytic Agent"
                                : "Calculate Dosage"}
                        </h2>
                        <p className="text-deep-charcoal/70 mb-6 text-center">
                            {currentStep === "selection"
                                ? "Choose the appropriate medication for treatment"
                                : "Enter patient details for precise dosing"}
                        </p>
                    </div>

                    {/* Content with animations */}
                    <div className="px-4 md:px-6 pb-6">
                        <AnimatePresence mode="wait">
                            {currentStep === "selection" && (
                                <motion.div
                                    key="selection"
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    variants={stepVariants}
                                    transition={{ duration: 0.3 }}
                                >
                                    <DrugSelection
                                        selectedDrug={selectedDrug}
                                        onDrugSelect={handleDrugSelect}
                                        isQuickCalc={true}
                                        onNext={() => {}}
                                        onBack={() => window.history.back()}
                                    />
                                </motion.div>
                            )}

                            {currentStep === "dosing" && selectedDrug && (
                                <motion.div
                                    key="dosing"
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    variants={stepVariants}
                                    transition={{ duration: 0.3 }}
                                >
                                    <DosingCalculator
                                        selectedDrug={selectedDrug}
                                        patientWeight={ptWeight}
                                        weightUnit={weightUnit}
                                        vialSize={vialSize}
                                        onWeightChange={setPtWeight}
                                        isQuickCalc={true}
                                        onWeightUnitChange={setWeightUnit}
                                        onVialSizeChange={setVialSize}
                                        onBack={handleBackFromDosing}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer */}
                        <div className="mt-8 pt-4 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
                            <p className="text-sm text-gray-500">
                                {currentStep === "selection"
                                    ? "Step 1 of 2"
                                    : "Step 2 of 2"}
                            </p>
                            {selectedDrug && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Selected:
                                    </span>
                                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
                                        {selectedDrug === "tnk"
                                            ? "Tenecteplase (TNK)"
                                            : "Alteplase (tPA)"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
}
