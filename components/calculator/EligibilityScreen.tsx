"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    FileText,
    Link as LinkIcon,
} from "lucide-react";

/* ---------- types ---------- */
interface EligibilityAnswers {
    underAge: boolean;
    hemorrhage: boolean;
    overTimeLimit: boolean;
    onMedications: boolean;
    contraindications: boolean;
    highBP: boolean;
    abnormalGlucose: boolean;
}
interface Props {
    eligibilityAnswers: EligibilityAnswers;
    setEligibilityAnswers: (a: EligibilityAnswers) => void;
    medicationsExpanded: boolean;
    setMedicationsExpanded: (b: boolean) => void;
    contraindicationsExpanded: boolean;
    setContraindicationsExpanded: (b: boolean) => void;
    onNext: () => void;
}

/* ---------- helper ---------- */
const pdfLink =
    "https://codes stroke-pro.s3.amazonaws.com/antihypertensive_algorithm.pdf"; // <-- replace with real
const decisionTree =
    "https://codes stroke-pro.s3.amazonaws.com/inclusion_exclusion.pdf"; // <-- replace with real

export default function EligibilityScreen({
    eligibilityAnswers,
    setEligibilityAnswers,
    medicationsExpanded,
    setMedicationsExpanded,
    contraindicationsExpanded,
    setContraindicationsExpanded,
    onNext,
}: Props) {
    /* ---------- computed eligibility ---------- */
    const status = (() => {
        const {
            underAge,
            hemorrhage,
            overTimeLimit,
            onMedications,
            contraindications,
            highBP,
            abnormalGlucose,
        } = eligibilityAnswers;

        const fails = [
            underAge && "Patient < 18 y",
            hemorrhage && "Intracranial haemorrhage",
            overTimeLimit && "Outside 4·5 h window",
            onMedications && "Anticoagulant / dual-antiplatelet",
            contraindications && "Other major contraindication",
            highBP && "BP > 185 / 110",
            abnormalGlucose && "Glucose < 50 or > 400 mg/dL",
        ].filter(Boolean);

        return {
            eligible: fails.length === 0,
            reason: fails.length ? fails[0]! : "All criteria satisfied",
        };
    })();

    /* ---------- tiny factory ---------- */
    const Row = ({
        id,
        label,
        checked,
        onChange,
    }: {
        id: string;
        label: string;
        checked: boolean;
        onChange: (b: boolean) => void;
    }) => (
        <div className="flex items-start gap-3">
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(c) => onChange(c as boolean)}
                className="mt-1"
            />
            <label
                htmlFor={id}
                className="text-sm text-clinical-slate cursor-pointer"
            >
                {label}
            </label>
        </div>
    );

    /* ---------- UI ---------- */
    return (
        <Card className="bg-white shadow-lg border border-harbor-gray">
            {/* header */}
            <CardHeader className="rounded-t-lg bg-clinical-slate/90 px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-parchment text-lg">
                    <Shield className="h-5 w-5" />
                    Step&nbsp;3: Eligibility Screening
                </CardTitle>
            </CardHeader>

            {/* body */}
            <CardContent className="space-y-6 px-4 py-6 md:px-8 md:py-8">
                <p className="text-sm text-clinical-slate/80">
                    Check every box that applies. All answers must be&nbsp;
                    <span className="font-medium text-vital-green">No</span> for
                    IV thrombolytic therapy to proceed.
                </p>

                {/* ---------------- questions ---------------- */}
                <div className="space-y-4">
                    <Row
                        id="q-age"
                        label="Patient < 18 years"
                        checked={eligibilityAnswers.underAge}
                        onChange={(val) =>
                            setEligibilityAnswers({
                                ...eligibilityAnswers,
                                underAge: val,
                            })
                        }
                    />

                    <Row
                        id="q-hemo"
                        label="Hemorrhage on CT / MRI"
                        checked={eligibilityAnswers.hemorrhage}
                        onChange={(val) =>
                            setEligibilityAnswers({
                                ...eligibilityAnswers,
                                hemorrhage: val,
                            })
                        }
                    />

                    <Row
                        id="q-time"
                        label="Last-known-well > 4.5 hours ago"
                        checked={eligibilityAnswers.overTimeLimit}
                        onChange={(val) =>
                            setEligibilityAnswers({
                                ...eligibilityAnswers,
                                overTimeLimit: val,
                            })
                        }
                    />

                    {/* -------- med row -------- */}
                    <Row
                        id="q-meds"
                        label="Active anticoagulant / high-risk antiplatelet"
                        checked={eligibilityAnswers.onMedications}
                        onChange={(val) =>
                            setEligibilityAnswers({
                                ...eligibilityAnswers,
                                onMedications: val,
                            })
                        }
                    />

                    {/* meds collapsible */}
                    <Collapsible
                        open={medicationsExpanded}
                        onOpenChange={setMedicationsExpanded}
                        className="pl-6"
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-auto p-0 text-xs text-clinical-slate/70 hover:text-clinical-slate"
                                name="medicationsList"
                            >
                                <span>Agent list &amp; notes</span>
                                {medicationsExpanded ? (
                                    <ChevronUp className="ml-1 h-4 w-4" />
                                ) : (
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 space-y-2 rounded-lg border border-clinical-slate/10 bg-clinical-slate/5 p-4 text-xs text-clinical-slate/90">
                            <p className="font-medium">Oral anticoagulants:</p>
                            <ul className="list-disc pl-5 space-y-0.5">
                                <li>Warfarin (Coumadin)</li>
                                <li>Apixaban (Eliquis)</li>
                                <li>Rivaroxaban (Xarelto)</li>
                                <li>Dabigatran (Pradaxa)</li>
                                <li>Edoxaban (Savaysa)</li>
                                <li>Betrixaban (Bevyxxa)</li>
                            </ul>

                            <p className="mt-2 font-medium">
                                Injectable / LMWH:
                            </p>
                            <ul className="list-disc pl-5 space-y-0.5">
                                <li>Enoxaparin (Lovenox)</li>
                                <li>Dalteparin (Fragmin)</li>
                                <li>Fondaparinux (Arixtra)</li>
                                <li>Heparin (UFH)</li>
                            </ul>

                            <p className="mt-2 font-medium">
                                Dual antiplatelet or high-risk single agents:
                            </p>
                            <ul className="list-disc pl-5 space-y-0.5">
                                <li>
                                    Aspirin&nbsp;+&nbsp;Clopidogrel /
                                    Dipyridamole
                                </li>
                                <li>
                                    Ticagrelor &nbsp;|&nbsp; Prasugrel
                                    &nbsp;|&nbsp; Cangrelor
                                </li>
                            </ul>

                            <p className="mt-2">
                                <em className="text-urgent-amber">Note:</em>{" "}
                                Patients on these drugs often require labs (INR,
                                aPTT, anti-Xa) &amp; consultant input&nbsp;prior
                                to lysis.
                            </p>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* -------- contraindications row -------- */}
                    <Row
                        id="q-contras"
                        label="Other major contraindication"
                        checked={eligibilityAnswers.contraindications}
                        onChange={(val) =>
                            setEligibilityAnswers({
                                ...eligibilityAnswers,
                                contraindications: val,
                            })
                        }
                    />

                    {/* contraindication collapsible */}
                    <Collapsible
                        open={contraindicationsExpanded}
                        onOpenChange={setContraindicationsExpanded}
                        className="pl-6"
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-auto p-0 text-xs text-clinical-slate/70 hover:text-clinical-slate"
                                name="fullListDecisionTree"
                            >
                                <span>Full list / decision tree</span>
                                {contraindicationsExpanded ? (
                                    <ChevronUp className="ml-1 h-4 w-4" />
                                ) : (
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 rounded-lg border border-clinical-slate/10 bg-clinical-slate/5 p-4 text-xs text-clinical-slate/90 space-y-3">
                            <div>
                                <p className="font-medium mb-1">
                                    Hemorrhage risk
                                </p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    <li>Active internal bleeding</li>
                                    <li>
                                        Recent head trauma / neurosurgery (&lt;3
                                        mo)
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-medium mb-1">Coagulopathy</p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    <li>Platelets &lt;100 000</li>
                                    <li>
                                        INR &gt;1.7 &nbsp;|&nbsp; PT &gt;15 s
                                    </li>
                                    <li>aPTT &gt;40 s</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-medium mb-1">
                                    Vascular lesions
                                </p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    <li>AVM / aneurysm with high bleed risk</li>
                                    <li>Intracranial neoplasm</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-medium mb-1">Other</p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    <li>NIHSS &gt;25 or rapidly improving</li>
                                    <li>
                                        Seizure with post-ictal deficit only
                                    </li>
                                    <li>
                                        Pregnancy{" "}
                                        <span className="italic">
                                            (relative)
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <a
                                href={decisionTree}
                                target="_blank"
                                className="mt-3 inline-flex items-center gap-1 text-vital-green underline hover:text-vital-green/80"
                            >
                                <FileText className="h-4 w-4" />
                                Inclusion / exclusion decision tree&nbsp;
                                <LinkIcon className="h-3 w-3" />
                            </a>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* BP */}
                    <Row
                        id="q-bp"
                        label="Blood pressure > 185 / 110 mmHg"
                        checked={eligibilityAnswers.highBP}
                        onChange={(val) =>
                            setEligibilityAnswers({
                                ...eligibilityAnswers,
                                highBP: val,
                            })
                        }
                    />

                    {/* glucose */}
                    <Row
                        id="q-glc"
                        label="Glucose < 50 or > 400 mg/dL"
                        checked={eligibilityAnswers.abnormalGlucose}
                        onChange={(val) =>
                            setEligibilityAnswers({
                                ...eligibilityAnswers,
                                abnormalGlucose: val,
                            })
                        }
                    />
                </div>

                {/* --------------- status --------------- */}
                <div className="space-y-4 border-t border-clinical-slate/10 pt-6">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-clinical-slate">
                            Eligibility Status
                        </span>
                        <Badge
                            className={`px-3 py-1 text-sm
              ${
                  status.eligible
                      ? "bg-vital-green/20 text-vital-green border-vital-green/30"
                      : "bg-critical-crimson/20 text-critical-crimson border-critical-crimson/30"
              }`}
                        >
                            {status.eligible ? (
                                <CheckCircle className="mr-1 h-4 w-4" />
                            ) : (
                                <XCircle className="mr-1 h-4 w-4" />
                            )}
                            {status.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                        </Badge>
                    </div>

                    <p className="text-sm text-clinical-slate/80">
                        {status.reason}
                    </p>

                    {!status.eligible && (
                        <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
                            <div className="flex items-center gap-2 font-medium text-red-800">
                                <AlertTriangle className="h-5 w-5" />
                                Thrombolytic therapy not recommended
                            </div>
                            <p className="text-sm text-red-700">
                                Consider alternative interventions and consult
                                neurology.
                            </p>

                            {/* high BP PDF helper */}
                            {eligibilityAnswers.highBP && (
                                <a
                                    href={pdfLink}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 text-red-700 underline hover:text-red-600"
                                >
                                    <FileText className="h-4 w-4" />
                                    IV antihypertensive algorithm&nbsp;
                                    <LinkIcon className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    )}

                    <Button
                        onClick={onNext}
                        className={`w-full ${
                            status.eligible
                                ? "bg-[#16675B] hover:bg-[#1F2937]"
                                : "bg-harbor-gray-dark hover:bg-harbor-gray/90"
                        } text-white`}
                        name="continueToDrugSelection"
                    >
                        {status.eligible
                            ? "Continue to Drug Selection"
                            : "Review Treatment Options"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import {
//     Shield,
//     CheckCircle,
//     XCircle,
//     ChevronDown,
//     ChevronUp,
//     AlertTriangle,
// } from "lucide-react";

// interface EligibilityAnswers {
//     underAge: boolean;
//     hemorrhage: boolean;
//     overTimeLimit: boolean;
//     onMedications: boolean;
//     contraindications: boolean;
//     highBP: boolean;
//     abnormalGlucose: boolean;
// }

// interface EligibilityScreenProps {
//     eligibilityAnswers: EligibilityAnswers;
//     setEligibilityAnswers: (answers: EligibilityAnswers) => void;
//     medicationsExpanded: boolean;
//     setMedicationsExpanded: (expanded: boolean) => void;
//     contraindicationsExpanded: boolean;
//     setContraindicationsExpanded: (expanded: boolean) => void;
//     onNext: () => void;
// }

// export default function EligibilityScreen({
//     eligibilityAnswers,
//     setEligibilityAnswers,
//     medicationsExpanded,
//     setMedicationsExpanded,
//     contraindicationsExpanded,
//     setContraindicationsExpanded,
//     onNext,
// }: EligibilityScreenProps) {
//     const getEligibilityStatus = (): {
//         eligible: boolean;
//         reason: string;
//         color: string;
//     } => {
//         if (eligibilityAnswers.underAge) {
//             return {
//                 eligible: false,
//                 reason: "Patient under 18 years old",
//                 color: "bg-red-100 text-red-800 border-red-200",
//             };
//         }
//         if (eligibilityAnswers.hemorrhage) {
//             return {
//                 eligible: false,
//                 reason: "Hemorrhage detected on imaging",
//                 color: "bg-red-100 text-red-800 border-red-200",
//             };
//         }
//         if (eligibilityAnswers.overTimeLimit) {
//             return {
//                 eligible: false,
//                 reason: "Outside time window",
//                 color: "bg-red-100 text-red-800 border-red-200",
//             };
//         }
//         if (eligibilityAnswers.onMedications) {
//             return {
//                 eligible: false,
//                 reason: "On contraindicated medications",
//                 color: "bg-red-100 text-red-800 border-red-200",
//             };
//         }
//         if (eligibilityAnswers.contraindications) {
//             return {
//                 eligible: false,
//                 reason: "Contraindications present",
//                 color: "bg-red-100 text-red-800 border-red-200",
//             };
//         }
//         if (eligibilityAnswers.highBP) {
//             return {
//                 eligible: false,
//                 reason: "Blood pressure too high (>185/110)",
//                 color: "bg-red-100 text-red-800 border-red-200",
//             };
//         }
//         if (eligibilityAnswers.abnormalGlucose) {
//             return {
//                 eligible: false,
//                 reason: "Glucose <50 or >400 mg/dL",
//                 color: "bg-red-100 text-red-800 border-red-200",
//             };
//         }
//         return {
//             eligible: true,
//             reason: "Patient eligible for thrombolytic therapy",
//             color: "bg-green-100 text-green-800 border-green-200",
//         };
//     };

//     const eligibilityStatus = getEligibilityStatus();

//     return (
//         <div className="space-y-6">
//             <Card className="bg-white/80 shadow-lg border-clinical-slate/20">
//                 <CardHeader className="bg-clinical-slate/5 border-b border-clinical-slate/10">
//                     <CardTitle className="flex items-center space-x-3 text-clinical-slate">
//                         <Shield className="w-6 h-6 text-harbor-gray" />
//                         <span>Step 3: Eligibility Screening</span>
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6 space-y-6">
//                     <p className="text-clinical-slate/80 mb-4">
//                         Check all applicable exclusion criteria. If none apply, the patient may be eligible for thrombolytic therapy.
//                     </p>

//                     {/* Eligibility Questions */}
//                     <div className="space-y-4">
//                         {/* Age */}
//                         <div className="flex items-center space-x-3">
//                             <Checkbox
//                                 id="under-age"
//                                 checked={eligibilityAnswers.underAge}
//                                 onCheckedChange={(checked) =>
//                                     setEligibilityAnswers({
//                                         ...eligibilityAnswers,
//                                         underAge: checked as boolean,
//                                     })
//                                 }
//                             />
//                             <label
//                                 htmlFor="under-age"
//                                 className="text-clinical-slate cursor-pointer"
//                             >
//                                 Patient is under 18 years old
//                             </label>
//                         </div>

//                         {/* Hemorrhage */}
//                         <div className="flex items-center space-x-3">
//                             <Checkbox
//                                 id="hemorrhage"
//                                 checked={eligibilityAnswers.hemorrhage}
//                                 onCheckedChange={(checked) =>
//                                     setEligibilityAnswers({
//                                         ...eligibilityAnswers,
//                                         hemorrhage: checked as boolean,
//                                     })
//                                 }
//                             />
//                             <label
//                                 htmlFor="hemorrhage"
//                                 className="text-clinical-slate cursor-pointer"
//                             >
//                                 Hemorrhage on CT/MRI
//                             </label>
//                         </div>

//                         {/* Time Window */}
//                         <div className="flex items-center space-x-3">
//                             <Checkbox
//                                 id="over-time-limit"
//                                 checked={eligibilityAnswers.overTimeLimit}
//                                 onCheckedChange={(checked) =>
//                                     setEligibilityAnswers({
//                                         ...eligibilityAnswers,
//                                         overTimeLimit: checked as boolean,
//                                     })
//                                 }
//                             />
//                             <label
//                                 htmlFor="over-time-limit"
//                                 className="text-clinical-slate cursor-pointer"
//                             >
//                                 Outside treatment time window (&gt;4.5 hours)
//                             </label>
//                         </div>

//                         {/* Medications */}
//                         <div className="flex items-center space-x-3">
//                             <Checkbox
//                                 id="on-medications"
//                                 checked={eligibilityAnswers.onMedications}
//                                 onCheckedChange={(checked) =>
//                                     setEligibilityAnswers({
//                                         ...eligibilityAnswers,
//                                         onMedications: checked as boolean,
//                                     })
//                                 }
//                             />
//                             <label
//                                 htmlFor="on-medications"
//                                 className="text-clinical-slate cursor-pointer"
//                             >
//                                 On anticoagulants or antiplatelet medications
//                             </label>
//                         </div>

//                         {/* Medications Details */}
//                         <Collapsible
//                             open={medicationsExpanded}
//                             onOpenChange={setMedicationsExpanded}
//                         >
//                             <CollapsibleTrigger asChild>
//                                 <Button
//                                     variant="ghost"
//                                     className="w-full justify-between p-0 h-auto text-clinical-slate/70 hover:text-clinical-slate"
//                                 >
//                                     <span className="text-sm">
//                                         View medication details
//                                     </span>
//                                     {medicationsExpanded ? (
//                                         <ChevronUp className="w-4 h-4" />
//                                     ) : (
//                                         <ChevronDown className="w-4 h-4" />
//                                     )}
//                                 </Button>
//                             </CollapsibleTrigger>
//                             <CollapsibleContent className="mt-2 p-4 bg-clinical-slate/5 rounded-lg border border-clinical-slate/10">
//                                 <div className="text-sm text-clinical-slate/80 space-y-2">
//                                     <p className="font-medium">
//                                         Contraindicated medications:
//                                     </p>
//                                     <ul className="list-disc pl-5 space-y-1">
//                                         <li>Warfarin (INR &gt;1.7)</li>
//                                         <li>Heparin (aPTT &gt;40s)</li>
//                                         <li>Direct oral anticoagulants (DOACs)</li>
//                                         <li>Clopidogrel, Ticagrelor, Prasugrel</li>
//                                         <li>Dual antiplatelet therapy</li>
//                                     </ul>
//                                 </div>
//                             </CollapsibleContent>
//                         </Collapsible>

//                         {/* Contraindications */}
//                         <div className="flex items-center space-x-3">
//                             <Checkbox
//                                 id="contraindications"
//                                 checked={eligibilityAnswers.contraindications}
//                                 onCheckedChange={(checked) =>
//                                     setEligibilityAnswers({
//                                         ...eligibilityAnswers,
//                                         contraindications: checked as boolean,
//                                     })
//                                 }
//                             />
//                             <label
//                                 htmlFor="contraindications"
//                                 className="text-clinical-slate cursor-pointer"
//                             >
//                                 Other contraindications present
//                             </label>
//                         </div>

//                         {/* Contraindications Details */}
//                         <Collapsible
//                             open={contraindicationsExpanded}
//                             onOpenChange={setContraindicationsExpanded}
//                         >
//                             <CollapsibleTrigger asChild>
//                                 <Button
//                                     variant="ghost"
//                                     className="w-full justify-between p-0 h-auto text-clinical-slate/70 hover:text-clinical-slate"
//                                 >
//                                     <span className="text-sm">
//                                         View contraindication details
//                                     </span>
//                                     {contraindicationsExpanded ? (
//                                         <ChevronUp className="w-4 h-4" />
//                                     ) : (
//                                         <ChevronDown className="w-4 h-4" />
//                                     )}
//                                 </Button>
//                             </CollapsibleTrigger>
//                             <CollapsibleContent className="mt-2 p-4 bg-clinical-slate/5 rounded-lg border border-clinical-slate/10">
//                                 <div className="text-sm text-clinical-slate/80 space-y-2">
//                                     <p className="font-medium">
//                                         Major contraindications:
//                                     </p>
//                                     <ul className="list-disc pl-5 space-y-1">
//                                         <li>Prior stroke in last 3 months</li>
//                                         <li>Major surgery in last 14 days</li>
//                                         <li>Active bleeding or bleeding diathesis</li>
//                                         <li>Platelet count &lt;100k</li>
//                                         <li>Suspected aortic dissection</li>
//                                         <li>Severe liver disease</li>
//                                         <li>Endocarditis</li>
//                                     </ul>
//                                 </div>
//                             </CollapsibleContent>
//                         </Collapsible>

//                         {/* High Blood Pressure */}
//                         <div className="flex items-center space-x-3">
//                             <Checkbox
//                                 id="high-bp"
//                                 checked={eligibilityAnswers.highBP}
//                                 onCheckedChange={(checked) =>
//                                     setEligibilityAnswers({
//                                         ...eligibilityAnswers,
//                                         highBP: checked as boolean,
//                                     })
//                                 }
//                             />
//                             <label
//                                 htmlFor="high-bp"
//                                 className="text-clinical-slate cursor-pointer"
//                             >
//                                 Blood pressure &gt;185/110 mmHg
//                             </label>
//                         </div>

//                         {/* Abnormal Glucose */}
//                         <div className="flex items-center space-x-3">
//                             <Checkbox
//                                 id="abnormal-glucose"
//                                 checked={eligibilityAnswers.abnormalGlucose}
//                                 onCheckedChange={(checked) =>
//                                     setEligibilityAnswers({
//                                         ...eligibilityAnswers,
//                                         abnormalGlucose: checked as boolean,
//                                     })
//                                 }
//                             />
//                             <label
//                                 htmlFor="abnormal-glucose"
//                                 className="text-clinical-slate cursor-pointer"
//                             >
//                                 Glucose <50 or >400 mg/dL
//                             </label>
//                         </div>
//                     </div>

//                     {/* Eligibility Status */}
//                     <div className="pt-4 border-t border-clinical-slate/10">
//                         <div className="flex items-center justify-between mb-4">
//                             <span className="font-medium text-clinical-slate">
//                                 Eligibility Status:
//                             </span>
//                             <Badge
//                                 className={`${eligibilityStatus.color} px-3 py-1 text-sm`}
//                             >
//                                 {eligibilityStatus.eligible ? (
//                                     <CheckCircle className="w-4 h-4 mr-2" />
//                                 ) : (
//                                     <XCircle className="w-4 h-4 mr-2" />
//                                 )}
//                                 {eligibilityStatus.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
//                             </Badge>
//                         </div>
//                         <p className="text-sm text-clinical-slate/80 mb-4">
//                             {eligibilityStatus.reason}
//                         </p>

//                         {!eligibilityStatus.eligible && (
//                             <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                                 <div className="flex items-center space-x-2 text-red-800">
//                                     <AlertTriangle className="w-5 h-5" />
//                                     <span className="font-medium">
//                                         Thrombolytic therapy not recommended
//                                     </span>
//                                 </div>
//                                 <p className="text-sm text-red-700 mt-2">
//                                     Consider alternative treatments and consult neurology.
//                                 </p>
//                             </div>
//                         )}

//                         <Button
//                             onClick={onNext}
//                             className="w-full mt-4 bg-harbor-gray hover:bg-harbor-gray/90 text-white"
//                         >
//                             {eligibilityStatus.eligible
//                                 ? "Continue to Drug Selection"
//                                 : "View Treatment Options"}
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }
