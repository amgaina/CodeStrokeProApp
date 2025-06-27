"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Shield,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
} from "lucide-react";

interface EligibilityAnswers {
    underAge: boolean;
    hemorrhage: boolean;
    overTimeLimit: boolean;
    onMedications: boolean;
    contraindications: boolean;
    highBP: boolean;
    abnormalGlucose: boolean;
}

interface EligibilityScreenProps {
    eligibilityAnswers: EligibilityAnswers;
    setEligibilityAnswers: (answers: EligibilityAnswers) => void;
    medicationsExpanded: boolean;
    setMedicationsExpanded: (expanded: boolean) => void;
    contraindicationsExpanded: boolean;
    setContraindicationsExpanded: (expanded: boolean) => void;
    onNext: () => void;
}

export default function EligibilityScreen({
    eligibilityAnswers,
    setEligibilityAnswers,
    medicationsExpanded,
    setMedicationsExpanded,
    contraindicationsExpanded,
    setContraindicationsExpanded,
    onNext,
}: EligibilityScreenProps) {
    const getEligibilityStatus = (): {
        eligible: boolean;
        reason: string;
        color: string;
    } => {
        if (eligibilityAnswers.underAge) {
            return {
                eligible: false,
                reason: "Patient under 18 years old",
                color: "bg-red-100 text-red-800 border-red-200",
            };
        }
        if (eligibilityAnswers.hemorrhage) {
            return {
                eligible: false,
                reason: "Hemorrhage detected on imaging",
                color: "bg-red-100 text-red-800 border-red-200",
            };
        }
        if (eligibilityAnswers.overTimeLimit) {
            return {
                eligible: false,
                reason: "Outside time window",
                color: "bg-red-100 text-red-800 border-red-200",
            };
        }
        if (eligibilityAnswers.onMedications) {
            return {
                eligible: false,
                reason: "On contraindicated medications",
                color: "bg-red-100 text-red-800 border-red-200",
            };
        }
        if (eligibilityAnswers.contraindications) {
            return {
                eligible: false,
                reason: "Contraindications present",
                color: "bg-red-100 text-red-800 border-red-200",
            };
        }
        if (eligibilityAnswers.highBP) {
            return {
                eligible: false,
                reason: "Blood pressure too high (>185/110)",
                color: "bg-red-100 text-red-800 border-red-200",
            };
        }
        if (eligibilityAnswers.abnormalGlucose) {
            return {
                eligible: false,
                reason: "Glucose <50 or >400 mg/dL",
                color: "bg-red-100 text-red-800 border-red-200",
            };
        }
        return {
            eligible: true,
            reason: "Patient eligible for thrombolytic therapy",
            color: "bg-green-100 text-green-800 border-green-200",
        };
    };

    const eligibilityStatus = getEligibilityStatus();

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 shadow-lg border-clinical-slate/20">
                <CardHeader className="bg-clinical-slate/5 border-b border-clinical-slate/10">
                    <CardTitle className="flex items-center space-x-3 text-clinical-slate">
                        <Shield className="w-6 h-6 text-harbor-gray" />
                        <span>Step 3: Eligibility Screening</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <p className="text-clinical-slate/80 mb-4">
                        Check all applicable exclusion criteria. If none apply, the patient may be eligible for thrombolytic therapy.
                    </p>

                    {/* Eligibility Questions */}
                    <div className="space-y-4">
                        {/* Age */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="under-age"
                                checked={eligibilityAnswers.underAge}
                                onCheckedChange={(checked) =>
                                    setEligibilityAnswers({
                                        ...eligibilityAnswers,
                                        underAge: checked as boolean,
                                    })
                                }
                            />
                            <label
                                htmlFor="under-age"
                                className="text-clinical-slate cursor-pointer"
                            >
                                Patient is under 18 years old
                            </label>
                        </div>

                        {/* Hemorrhage */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="hemorrhage"
                                checked={eligibilityAnswers.hemorrhage}
                                onCheckedChange={(checked) =>
                                    setEligibilityAnswers({
                                        ...eligibilityAnswers,
                                        hemorrhage: checked as boolean,
                                    })
                                }
                            />
                            <label
                                htmlFor="hemorrhage"
                                className="text-clinical-slate cursor-pointer"
                            >
                                Hemorrhage on CT/MRI
                            </label>
                        </div>

                        {/* Time Window */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="over-time-limit"
                                checked={eligibilityAnswers.overTimeLimit}
                                onCheckedChange={(checked) =>
                                    setEligibilityAnswers({
                                        ...eligibilityAnswers,
                                        overTimeLimit: checked as boolean,
                                    })
                                }
                            />
                            <label
                                htmlFor="over-time-limit"
                                className="text-clinical-slate cursor-pointer"
                            >
                                Outside treatment time window (&gt;4.5 hours)
                            </label>
                        </div>

                        {/* Medications */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="on-medications"
                                checked={eligibilityAnswers.onMedications}
                                onCheckedChange={(checked) =>
                                    setEligibilityAnswers({
                                        ...eligibilityAnswers,
                                        onMedications: checked as boolean,
                                    })
                                }
                            />
                            <label
                                htmlFor="on-medications"
                                className="text-clinical-slate cursor-pointer"
                            >
                                On anticoagulants or antiplatelet medications
                            </label>
                        </div>

                        {/* Medications Details */}
                        <Collapsible
                            open={medicationsExpanded}
                            onOpenChange={setMedicationsExpanded}
                        >
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between p-0 h-auto text-clinical-slate/70 hover:text-clinical-slate"
                                >
                                    <span className="text-sm">
                                        View medication details
                                    </span>
                                    {medicationsExpanded ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 p-4 bg-clinical-slate/5 rounded-lg border border-clinical-slate/10">
                                <div className="text-sm text-clinical-slate/80 space-y-2">
                                    <p className="font-medium">
                                        Contraindicated medications:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Warfarin (INR &gt;1.7)</li>
                                        <li>Heparin (aPTT &gt;40s)</li>
                                        <li>Direct oral anticoagulants (DOACs)</li>
                                        <li>Clopidogrel, Ticagrelor, Prasugrel</li>
                                        <li>Dual antiplatelet therapy</li>
                                    </ul>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Contraindications */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="contraindications"
                                checked={eligibilityAnswers.contraindications}
                                onCheckedChange={(checked) =>
                                    setEligibilityAnswers({
                                        ...eligibilityAnswers,
                                        contraindications: checked as boolean,
                                    })
                                }
                            />
                            <label
                                htmlFor="contraindications"
                                className="text-clinical-slate cursor-pointer"
                            >
                                Other contraindications present
                            </label>
                        </div>

                        {/* Contraindications Details */}
                        <Collapsible
                            open={contraindicationsExpanded}
                            onOpenChange={setContraindicationsExpanded}
                        >
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between p-0 h-auto text-clinical-slate/70 hover:text-clinical-slate"
                                >
                                    <span className="text-sm">
                                        View contraindication details
                                    </span>
                                    {contraindicationsExpanded ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 p-4 bg-clinical-slate/5 rounded-lg border border-clinical-slate/10">
                                <div className="text-sm text-clinical-slate/80 space-y-2">
                                    <p className="font-medium">
                                        Major contraindications:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Prior stroke in last 3 months</li>
                                        <li>Major surgery in last 14 days</li>
                                        <li>Active bleeding or bleeding diathesis</li>
                                        <li>Platelet count &lt;100k</li>
                                        <li>Suspected aortic dissection</li>
                                        <li>Severe liver disease</li>
                                        <li>Endocarditis</li>
                                    </ul>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* High Blood Pressure */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="high-bp"
                                checked={eligibilityAnswers.highBP}
                                onCheckedChange={(checked) =>
                                    setEligibilityAnswers({
                                        ...eligibilityAnswers,
                                        highBP: checked as boolean,
                                    })
                                }
                            />
                            <label
                                htmlFor="high-bp"
                                className="text-clinical-slate cursor-pointer"
                            >
                                Blood pressure &gt;185/110 mmHg
                            </label>
                        </div>

                        {/* Abnormal Glucose */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="abnormal-glucose"
                                checked={eligibilityAnswers.abnormalGlucose}
                                onCheckedChange={(checked) =>
                                    setEligibilityAnswers({
                                        ...eligibilityAnswers,
                                        abnormalGlucose: checked as boolean,
                                    })
                                }
                            />
                            <label
                                htmlFor="abnormal-glucose"
                                className="text-clinical-slate cursor-pointer"
                            >
                                Glucose <50 or >400 mg/dL
                            </label>
                        </div>
                    </div>

                    {/* Eligibility Status */}
                    <div className="pt-4 border-t border-clinical-slate/10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium text-clinical-slate">
                                Eligibility Status:
                            </span>
                            <Badge
                                className={`${eligibilityStatus.color} px-3 py-1 text-sm`}
                            >
                                {eligibilityStatus.eligible ? (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                ) : (
                                    <XCircle className="w-4 h-4 mr-2" />
                                )}
                                {eligibilityStatus.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                            </Badge>
                        </div>
                        <p className="text-sm text-clinical-slate/80 mb-4">
                            {eligibilityStatus.reason}
                        </p>

                        {!eligibilityStatus.eligible && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center space-x-2 text-red-800">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span className="font-medium">
                                        Thrombolytic therapy not recommended
                                    </span>
                                </div>
                                <p className="text-sm text-red-700 mt-2">
                                    Consider alternative treatments and consult neurology.
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={onNext}
                            className="w-full mt-4 bg-harbor-gray hover:bg-harbor-gray/90 text-white"
                        >
                            {eligibilityStatus.eligible
                                ? "Continue to Drug Selection"
                                : "View Treatment Options"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
