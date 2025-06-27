"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Shield, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface EligibilityAnswers {
    underAge: boolean;
    hemorrhage: boolean;
    overTimeLimit: boolean;
    onMedications: boolean;
    contraindications: boolean;
    highBP: boolean;
    abnormalGlucose: boolean;
    rapidImprovement: boolean;
    minorSymptoms: boolean;
    recentSurgery: boolean;
    activeBleed: boolean;
}

interface EligibilityScreeningProps {
    answers: EligibilityAnswers;
    onAnswerChange: (answers: EligibilityAnswers) => void;
    onNext: () => void;
    onBack?: () => void;
}

export default function EligibilityScreening({ 
    answers, 
    onAnswerChange, 
    onNext,
    onBack
}: EligibilityScreeningProps) {
    const [medicationsExpanded, setMedicationsExpanded] = useState(false);
    const [contraindicationsExpanded, setContraindicationsExpanded] = useState(false);

    const updateAnswer = (key: keyof EligibilityAnswers, value: boolean) => {
        onAnswerChange({
            ...answers,
            [key]: value,
        });
    };

    const getEligibilityStatus = (): {
        status: "eligible" | "evaluate" | "ineligible";
        message: string;
        color: string;
    } => {
        // Absolute contraindications
        if (answers.underAge || answers.hemorrhage || answers.overTimeLimit) {
            return {
                status: "ineligible",
                message: "Patient is NOT eligible for thrombolytic therapy",
                color: "red",
            };
        }

        // Relative contraindications requiring evaluation
        if (
            answers.onMedications ||
            answers.contraindications ||
            answers.highBP ||
            answers.abnormalGlucose ||
            answers.rapidImprovement ||
            answers.minorSymptoms ||
            answers.recentSurgery ||
            answers.activeBleed
        ) {
            return {
                status: "evaluate",
                message: "Careful evaluation required - Relative contraindications present",
                color: "amber",
            };
        }

        return {
            status: "eligible",
            message: "Patient appears eligible for thrombolytic therapy",
            color: "green",
        };
    };

    const eligibilityStatus = getEligibilityStatus();

    return (
        <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
            <CardHeader className="bg-clinical-slate text-parchment p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                    <Shield className="w-5 h-5 md:w-6 md:h-6" />
                    Thrombolytic Eligibility Screening
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                {/* Absolute Contraindications */}
                <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                        Absolute Contraindications
                    </h3>
                    <p className="text-sm text-gray-600">
                        Any "Yes" answer excludes thrombolytic therapy
                    </p>

                    {[
                        {
                            key: "underAge" as keyof EligibilityAnswers,
                            label: "Is the patient under 18 years of age?",
                        },
                        {
                            key: "hemorrhage" as keyof EligibilityAnswers,
                            label: "Does head CT show evidence of intracranial hemorrhage?",
                        },
                        {
                            key: "overTimeLimit" as keyof EligibilityAnswers,
                            label: "Is symptom onset (LKW) more than 4.5 hours ago?",
                        },
                    ].map((question) => (
                        <div
                            key={question.key}
                            className={`flex items-start space-x-3 p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                                answers[question.key] 
                                    ? "border-red-300 bg-red-50" 
                                    : "border-gray-200"
                            }`}
                        >
                            <Checkbox
                                id={question.key}
                                checked={answers[question.key]}
                                onCheckedChange={(checked) =>
                                    updateAnswer(question.key, checked === true)
                                }
                                className="mt-1"
                            />
                            <Label
                                htmlFor={question.key}
                                className="text-sm leading-relaxed cursor-pointer font-medium"
                            >
                                {question.label}
                            </Label>
                        </div>
                    ))}
                </div>

                {/* Relative Contraindications */}
                <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
                        Relative Contraindications
                    </h3>
                    <p className="text-sm text-gray-600">
                        Require careful evaluation and risk-benefit analysis
                    </p>

                    {/* Blood Pressure */}
                    <div className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                        answers.highBP ? "border-amber-300 bg-amber-50" : "border-gray-200"
                    }`}>
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="highBP"
                                checked={answers.highBP}
                                onCheckedChange={(checked) =>
                                    updateAnswer("highBP", checked === true)
                                }
                                className="mt-1"
                            />
                            <Label
                                htmlFor="highBP"
                                className="text-sm font-medium cursor-pointer"
                            >
                                Blood pressure &gt;185/110 mmHg on repeated measures?
                            </Label>
                        </div>
                    </div>

                    {/* Glucose */}
                    <div className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                        answers.abnormalGlucose ? "border-amber-300 bg-amber-50" : "border-gray-200"
                    }`}>
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="abnormalGlucose"
                                checked={answers.abnormalGlucose}
                                onCheckedChange={(checked) =>
                                    updateAnswer("abnormalGlucose", checked === true)
                                }
                                className="mt-1"
                            />
                            <Label
                                htmlFor="abnormalGlucose"
                                className="text-sm font-medium cursor-pointer"
                            >
                                Blood glucose &lt;50 mg/dL or &gt;400 mg/dL?
                            </Label>
                        </div>
                    </div>

                    {/* Clinical Assessment */}
                    <div className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                        answers.rapidImprovement ? "border-amber-300 bg-amber-50" : "border-gray-200"
                    }`}>
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="rapidImprovement"
                                checked={answers.rapidImprovement}
                                onCheckedChange={(checked) =>
                                    updateAnswer("rapidImprovement", checked === true)
                                }
                                className="mt-1"
                            />
                            <Label
                                htmlFor="rapidImprovement"
                                className="text-sm font-medium cursor-pointer"
                            >
                                Are symptoms rapidly improving to near normal?
                            </Label>
                        </div>
                    </div>

                    <div className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                        answers.minorSymptoms ? "border-amber-300 bg-amber-50" : "border-gray-200"
                    }`}>
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="minorSymptoms"
                                checked={answers.minorSymptoms}
                                onCheckedChange={(checked) =>
                                    updateAnswer("minorSymptoms", checked === true)
                                }
                                className="mt-1"
                            />
                            <Label
                                htmlFor="minorSymptoms"
                                className="text-sm font-medium cursor-pointer"
                            >
                                Are symptoms mild and non-disabling (NIHSS &lt;4)?
                            </Label>
                        </div>
                    </div>

                    {/* Medications */}
                    <div className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                        answers.onMedications ? "border-amber-300 bg-amber-50" : "border-gray-200"
                    }`}>
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="onMedications"
                                checked={answers.onMedications}
                                onCheckedChange={(checked) =>
                                    updateAnswer("onMedications", checked === true)
                                }
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <Label
                                    htmlFor="onMedications"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    Is the patient on anticoagulants or recent antiplatelet therapy?
                                </Label>

                                <Collapsible
                                    open={medicationsExpanded}
                                    onOpenChange={setMedicationsExpanded}
                                >
                                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        {medicationsExpanded ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                        View Medication Details
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="mt-4 space-y-4">
                                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2 text-sm">
                                                <AlertTriangle className="w-3 h-3" />
                                                Anticoagulants (High Risk)
                                            </h4>
                                            <div className="space-y-1 text-xs text-red-700">
                                                <p>• Warfarin (check INR)</p>
                                                <p>• Direct oral anticoagulants (DOACs)</p>
                                                <p>• Heparin products (check aPTT/anti-Xa)</p>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">
                                                Recent Antiplatelet Therapy
                                            </h4>
                                            <div className="space-y-1 text-xs text-yellow-700">
                                                <p>• Dual antiplatelet therapy within 24 hours</p>
                                                <p>• Clopidogrel, ticagrelor, or prasugrel</p>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        </div>
                    </div>

                    {/* Additional Contraindications - Collapsible */}
                    <div className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                        answers.contraindications ? "border-amber-300 bg-amber-50" : "border-gray-200"
                    }`}>
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="contraindications"
                                checked={answers.contraindications}
                                onCheckedChange={(checked) =>
                                    updateAnswer("contraindications", checked === true)
                                }
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <Label
                                    htmlFor="contraindications"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    Are there other clinical contraindications?
                                </Label>

                                <Collapsible
                                    open={contraindicationsExpanded}
                                    onOpenChange={setContraindicationsExpanded}
                                >
                                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        {contraindicationsExpanded ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                        View Contraindication List
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="mt-4">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                                                <div>
                                                    <p>• Recent major surgery (&lt;14 days)</p>
                                                    <p>• Active internal bleeding</p>
                                                    <p>• History of intracranial hemorrhage</p>
                                                    <p>• Severe liver disease</p>
                                                </div>
                                                <div>
                                                    <p>• Platelet count &lt;100,000</p>
                                                    <p>• Suspected aortic dissection</p>
                                                    <p>• Pregnancy</p>
                                                    <p>• Arterial puncture at non-compressible site</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Eligibility Status */}
                <Alert className={`border-${eligibilityStatus.color}-300 bg-${eligibilityStatus.color}-50`}>
                    <AlertTriangle className={`h-5 w-5 text-${eligibilityStatus.color}-600`} />
                    <AlertDescription className="font-medium">
                        <strong className={`text-${eligibilityStatus.color}-800`}>
                            Assessment: 
                        </strong>{" "}
                        {eligibilityStatus.message}
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
                            Back to Timers
                        </Button>
                    )}
                    <Button
                        onClick={onNext}
                        className={`text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto ${
                            eligibilityStatus.status === "ineligible"
                                ? "bg-gray-500 hover:bg-gray-600"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {eligibilityStatus.status === "ineligible"
                            ? "Review Alternative Therapies"
                            : "Continue to Drug Selection"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
