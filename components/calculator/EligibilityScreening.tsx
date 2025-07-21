"use client";

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
import { useState } from "react";
import { PDFLink } from "../PDFLink";

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
    onBack,
}: EligibilityScreeningProps) {
    const [medicationsExpanded, setMedicationsExpanded] = useState(false);
    const [contraindicationsExpanded, setContraindicationsExpanded] =
        useState(false);

    const updateAnswer = (key: keyof EligibilityAnswers, value: boolean) => {
        onAnswerChange({
            ...answers,
            [key]: value,
        });
    };

    const getEligibilityStatus = (): {
        status: "eligible" | "evaluate" | "ineligible" | "correct";
        message: string;
        color: string;
    } => {
        // Absolute contraindications - Patient NOT eligible (cannot proceed)
        if (
            answers.underAge ||
            answers.hemorrhage ||
            answers.overTimeLimit ||
            answers.activeBleed ||
            answers.recentSurgery
        ) {
            return {
                status: "ineligible",
                message: "Patient is NOT eligible for thrombolytic therapy",
                color: "red",
            };
        }

        // Correctable issues - Need to correct before considering thrombolytic
        if (answers.highBP || answers.abnormalGlucose) {
            return {
                status: "correct",
                message:
                    "Correct BP or glucose levels before considering thrombolytic therapy",
                color: "amber",
            };
        }

        // Relative contraindications - Further evaluation needed to discuss risks vs benefits
        if (
            answers.onMedications ||
            answers.contraindications ||
            answers.rapidImprovement ||
            answers.minorSymptoms
        ) {
            return {
                status: "evaluate",
                message:
                    "Further evaluation needed to discuss risks vs benefit of thrombolytic therapy",
                color: "amber",
            };
        }

        // All criteria met - Consider thrombolytic therapy
        return {
            status: "eligible",
            message: "Consider thrombolytic therapy - All criteria met",
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
                            label: "Is the patient <18 years of age?",
                        },
                        {
                            key: "hemorrhage" as keyof EligibilityAnswers,
                            label: "Did head CT suggest or confirm any hemorrhage?",
                        },
                        {
                            key: "overTimeLimit" as keyof EligibilityAnswers,
                            label: "Is the patient's last known well more than 4.5 hours ago?",
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
                    <div
                        className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                            answers.highBP
                                ? "border-amber-300 bg-amber-50"
                                : "border-gray-200"
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="highBP"
                                checked={answers.highBP}
                                onCheckedChange={(checked) =>
                                    updateAnswer("highBP", checked === true)
                                }
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <Label
                                    htmlFor="highBP"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    Is BP &gt;185/110?
                                </Label>
                                {answers.highBP && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                        <p className="text-sm text-blue-700 font-medium mb-3">
                                            📄 Reference Guide Available:
                                        </p>
                                        <div className="w-full">
                                            <PDFLink
                                                filename="antihypertensives.pdf"
                                                title="Antihypertensives Guide"
                                                variant="button"
                                                showDownload={true}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Glucose */}
                    <div
                        className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                            answers.abnormalGlucose
                                ? "border-amber-300 bg-amber-50"
                                : "border-gray-200"
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="abnormalGlucose"
                                checked={answers.abnormalGlucose}
                                onCheckedChange={(checked) =>
                                    updateAnswer(
                                        "abnormalGlucose",
                                        checked === true
                                    )
                                }
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <Label
                                    htmlFor="abnormalGlucose"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    Is the blood glucose less than 50 mg/dL or
                                    greater than 400 mg/dL?
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Medications */}
                    <div
                        className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                            answers.onMedications
                                ? "border-amber-300 bg-amber-50"
                                : "border-gray-200"
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="onMedications"
                                checked={answers.onMedications}
                                onCheckedChange={(checked) =>
                                    updateAnswer(
                                        "onMedications",
                                        checked === true
                                    )
                                }
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <Label
                                    htmlFor="onMedications"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    Is the patient currently taking any of the
                                    following medications?
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
                                                Anticoagulants (Blood Thinners –
                                                Affect Clotting Cascade)
                                            </h4>

                                            <div className="mb-3">
                                                <h5 className="font-medium text-red-700 text-xs mb-1">
                                                    Oral Anticoagulants:
                                                </h5>
                                                <div className="space-y-1 text-xs text-red-700 ml-2">
                                                    <p>• Warfarin (Coumadin)</p>
                                                    <p>• Apixaban (Eliquis)</p>
                                                    <p>
                                                        • Rivaroxaban (Xarelto)
                                                    </p>
                                                    <p>
                                                        • Dabigatran (Pradaxa)
                                                    </p>
                                                    <p>• Edoxaban (Savaysa)</p>
                                                    <p>
                                                        • Betrixaban (Bevyxxa)
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="font-medium text-red-700 text-xs mb-1">
                                                    Injectable Anticoagulants:
                                                </h5>
                                                <div className="space-y-1 text-xs text-red-700 ml-2">
                                                    <p>
                                                        • Enoxaparin (Lovenox) -
                                                        Especially at
                                                        therapeutic doses
                                                    </p>
                                                    <p>
                                                        • Dalteparin (Fragmin)
                                                    </p>
                                                    <p>
                                                        • Fondaparinux (Arixtra)
                                                    </p>
                                                    <p>
                                                        • Heparin
                                                        (unfractionated) -
                                                        Particularly if aPTT is
                                                        elevated
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">
                                                Antiplatelet Agents (Not
                                                absolute contraindications but
                                                clinically relevant)
                                            </h4>
                                            <p className="text-xs text-yellow-700 mb-2 italic">
                                                These don't usually preclude
                                                thrombolytic therapy alone, but
                                                combined with anticoagulants or
                                                in high-risk patients, may
                                                influence bleeding risk:
                                            </p>
                                            <div className="space-y-1 text-xs text-yellow-700 ml-2">
                                                <p>• Aspirin</p>
                                                <p>• Clopidogrel</p>
                                                <p>• Ticagrelor</p>
                                                <p>• Prasugrel</p>
                                                <p>
                                                    • Dipyridamole/aspirin combo
                                                </p>
                                                <p>• Cangrelor</p>
                                                <p>• Ticlopidine</p>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                            <h4 className="font-semibold text-blue-800 mb-2 text-sm">
                                                Clinical Note
                                            </h4>
                                            <p className="text-xs text-blue-700">
                                                Patients taking any of the above
                                                medications — especially oral
                                                anticoagulants — may require
                                                additional labs (INR, aPTT,
                                                anti-Xa levels) and physician
                                                consultation before proceeding
                                                with thrombolytic therapy.
                                            </p>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        </div>
                    </div>

                    {/* Additional Contraindications - Collapsible */}
                    <div
                        className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                            answers.contraindications
                                ? "border-amber-300 bg-amber-50"
                                : "border-gray-200"
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="contraindications"
                                checked={answers.contraindications}
                                onCheckedChange={(checked) =>
                                    updateAnswer(
                                        "contraindications",
                                        checked === true
                                    )
                                }
                                className="mt-1"
                            />
                            <div className="flex-1 max-w-[80%]">
                                <Label
                                    htmlFor="contraindications"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    Are there any known contraindications to
                                    receiving a thrombolytic?
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
                                    <CollapsibleContent className="mt-4 ">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <div className="space-y-4 text-xs text-gray-700">
                                                <div>
                                                    <h5 className="font-semibold text-gray-800 mb-2">
                                                        Hemorrhage Risk
                                                    </h5>
                                                    <ul className="space-y-1 ml-2">
                                                        <li>
                                                            • Active internal
                                                            bleeding
                                                        </li>
                                                        <li>
                                                            • Recent (within 3
                                                            months)
                                                            intracranial/spinal
                                                            surgery, serious
                                                            head trauma, or
                                                            previous stroke
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h5 className="font-semibold text-gray-800 mb-2">
                                                        Coagulopathy
                                                    </h5>
                                                    <ul className="space-y-1 ml-2">
                                                        <li>
                                                            • Platelets
                                                            &lt;100,000
                                                        </li>
                                                        <li>
                                                            • INR &gt;1.7 or PT
                                                            &gt;15 sec
                                                        </li>
                                                        <li>
                                                            • aPTT &gt;40 sec
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h5 className="font-semibold text-gray-800 mb-2">
                                                        Vascular
                                                    </h5>
                                                    <ul className="space-y-1 ml-2">
                                                        <li>
                                                            • Known AVM,
                                                            aneurysm, or
                                                            neoplasm with high
                                                            bleeding risk
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h5 className="font-semibold text-gray-800 mb-2">
                                                        Other
                                                    </h5>
                                                    <ul className="space-y-1 ml-2">
                                                        <li>
                                                            • Symptoms resolving
                                                            rapidly
                                                        </li>
                                                        <li>
                                                            • Seizure at stroke
                                                            onset with postictal
                                                            deficits only
                                                        </li>
                                                        <li>
                                                            • Recent GI or GU
                                                            hemorrhage (within
                                                            21 days)
                                                        </li>
                                                        <li>
                                                            • Infective
                                                            endocarditis or
                                                            suspected aortic
                                                            dissection
                                                        </li>
                                                        <li>
                                                            • Pregnancy
                                                            (relative exclusion)
                                                        </li>
                                                        <li>
                                                            • Age &gt;80 years
                                                            (Weigh risks vs.
                                                            Benefit)
                                                        </li>
                                                        <li>
                                                            • NIH Stroke Scale
                                                            (NIHSS) &gt;25
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-300">
                                                <p className="text-sm text-blue-700 font-medium mb-3">
                                                    📄 Clinical Reference Guide:
                                                </p>
                                                <div className="w-full">
                                                    <PDFLink
                                                        filename="inclusion-and-exclusion-criteria-decision-tree.pdf"
                                                        title="Inclusion & Exclusion Criteria Decision Tree"
                                                        variant="button"
                                                        showDownload={true}
                                                    />
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
                <Alert
                    className={`${
                        eligibilityStatus.status === "ineligible"
                            ? "border-critical-crimson bg-critical-crimson/10"
                            : eligibilityStatus.status === "evaluate" ||
                              eligibilityStatus.status === "correct"
                            ? "border-urgent-amber bg-urgent-amber/10"
                            : "border-vital-green bg-vital-green/10"
                    }`}
                >
                    <AlertTriangle
                        className={`h-5 w-5 ${
                            eligibilityStatus.status === "ineligible"
                                ? "text-critical-crimson"
                                : eligibilityStatus.status === "evaluate" ||
                                  eligibilityStatus.status === "correct"
                                ? "text-urgent-amber"
                                : "text-vital-green"
                        }`}
                    />
                    <AlertDescription className="font-medium">
                        <strong
                            className={`${
                                eligibilityStatus.status === "ineligible"
                                    ? "text-critical-crimson"
                                    : eligibilityStatus.status === "evaluate" ||
                                      eligibilityStatus.status === "correct"
                                    ? "text-urgent-amber"
                                    : "text-vital-green"
                            }`}
                        >
                            Assessment:
                        </strong>{" "}
                        {eligibilityStatus.message}
                        {eligibilityStatus.status === "ineligible" && (
                            <>
                                <br />
                                <span className="text-sm text-critical-crimson/80 mt-2 block">
                                    Further evaluation needed to discuss risks
                                    vs benefit of thrombolytic therapy
                                </span>
                            </>
                        )}
                        {eligibilityStatus.status === "correct" && (
                            <>
                                <br />
                                <span className="text-sm text-urgent-amber/80 mt-2 block">
                                    <strong>Action Required:</strong> Address BP
                                    (&gt;185/110) or glucose levels (&lt;50 or
                                    &gt;400 mg/dL) before proceeding with
                                    thrombolytic consideration.
                                </span>
                            </>
                        )}
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
                        onClick={() => {
                            if (
                                eligibilityStatus.status === "eligible" ||
                                eligibilityStatus.status === "evaluate"
                            ) {
                                onNext();
                            }
                        }}
                        disabled={
                            eligibilityStatus.status === "ineligible" ||
                            eligibilityStatus.status === "correct"
                        }
                        className={`text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto ${
                            eligibilityStatus.status === "ineligible"
                                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                : eligibilityStatus.status === "correct"
                                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                : eligibilityStatus.status === "evaluate"
                                ? "bg-urgent-amber hover:bg-urgent-amber/90 text-white"
                                : "bg-vital-green hover:bg-vital-green/90 text-white"
                        }`}
                    >
                        {eligibilityStatus.status === "ineligible"
                            ? "Patient Not Eligible - Cannot Proceed"
                            : eligibilityStatus.status === "correct"
                            ? "Correct Issues Before Proceeding"
                            : eligibilityStatus.status === "evaluate"
                            ? "Continue with Caution - Evaluation Needed"
                            : "Continue to Drug Selection"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
