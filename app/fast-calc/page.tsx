"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DrugSelection from "@/components/calculator/DrugSelection";
import DosingCalculator from "@/components/calculator/DosingCalculator";

interface DosingFlowProps {
    initialSelectedDrug?: "tnk" | "alteplase" | null;
    onComplete?: () => void;
    onBackToScreening?: () => void;
}

export default function DosingFlow({
    initialSelectedDrug = null,
    onComplete,
    onBackToScreening,
}: DosingFlowProps) {
    const [selectedDrug, setSelectedDrug] = useState<"tnk" | "alteplase" | null>(
        initialSelectedDrug
    );
    const [vialSize, setVialSize] = useState("");
    const [ptWeight, setPtWeight] = useState("");
    const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
    const [currentStep, setCurrentStep] = useState<"selection" | "dosing">(
        initialSelectedDrug ? "dosing" : "selection"
    );

    const handleDrugSelect = (drug: "tnk" | "alteplase" | null) => {
        setSelectedDrug(drug);
        setCurrentStep("dosing");
    };

    const handleBackFromDosing = () => {
        setCurrentStep("selection");
    };

    const handleComplete = () => {
        onComplete?.();
    };

    // Animation variants
    const stepVariants = {
        enter: { opacity: 0, x: 50 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-xl mt-5 shadow-lg">
            {/* Step indicator */}
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'selection' ? 'bg-clinical-slate text-white' : 'bg-blue-100 text-clinical-slate'} transition-colors`}>
                        1
                    </div>
                    <div className={`w-16 h-1 ${currentStep === 'selection' ? 'bg-blue-100' : 'bg-clinical-slate'} transition-colors`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'dosing' ? 'bg-clinical-slate text-white' : 'bg-blue-100 text-blue-600'} transition-colors`}>
                        2
                    </div>
                </div>
            </div>

            {/* Header */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
                {currentStep === 'selection' ? 'Select Thrombolytic Agent' : 'Calculate Dosage'}
            </h1>
            <p className="text-gray-600 mb-8 text-center">
                {currentStep === 'selection'
                    ? 'Choose the appropriate medication for treatment'
                    : 'Enter patient details for precise dosing'}
            </p>

            {/* Content with animations */}
            <div className="min-h-[400px]">
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
                                onNext={() => { }}
                                onBack={onBackToScreening}
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
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    {currentStep === 'selection' ? 'Step 1 of 2' : 'Step 2 of 2'}
                </p>
                {selectedDrug && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Selected:</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {selectedDrug === 'tnk' ? 'Tenecteplase (TNK)' : 'Alteplase (tPA)'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}