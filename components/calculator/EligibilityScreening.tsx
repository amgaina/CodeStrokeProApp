"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    Shield,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/*******************************
 * Types
 ******************************/
export interface EligibilityAnswers {
    // Absolute
    underAge: boolean;
    hemorrhage: boolean;
    overTimeLimit: boolean;
    // Relative / correctable
    highBP: boolean;
    abnormalGlucose: boolean;
    onMedications: boolean;
    contraindications: boolean;
}

interface EligibilityScreeningProps {
    answers: EligibilityAnswers;
    onAnswerChange: (answers: EligibilityAnswers) => void;
    onNext: () => void;
    onBack?: () => void;
}

/*******************************
 * Helper arrays for questions
 ******************************/
const ABSOLUTE_Q = [
    {
        key: "underAge" as const,
        label: "Is the patient under 18 years of age?",
    },
    {
        key: "hemorrhage" as const,
        label: "Did head CT suggest or confirm any hemorrhage?",
    },
    {
        key: "overTimeLimit" as const,
        label: "Is the patient's last‑known‑well more than 4.5 hours ago?",
    },
];

const VITALS_Q = [
    {
        key: "highBP" as const,
        label: "Is blood pressure >185/110 mmHg",
        link: "/pdfs/acute_stroke_antihypertensives.pdf",
    },
    {
        key: "abnormalGlucose" as const,
        label: "Is the Blood glucose <50 mg/dL or >400 mg/dL",
    },
];

export default function EligibilityScreening({
    answers,
    onAnswerChange,
    onNext,
    onBack,
}: EligibilityScreeningProps) {
    /*******************************
     * Local UI state
     ******************************/
    const [showMeds, setShowMeds] = useState(false);
    const [showOtherCI, setShowOtherCI] = useState(false);

    /*******************************
     * Helpers
     ******************************/
    const update = (key: keyof EligibilityAnswers, value: boolean) => {
        onAnswerChange({ ...answers, [key]: value });
    };

    const anyTrue = Object.values(answers).some(Boolean);
    const absoluteFailed = ABSOLUTE_Q.some((q) => answers[q.key]);
    const disabledNext = anyTrue; // only advance when ALL answers are "No"

    const summary = absoluteFailed
        ? {
            color: "red",
            icon: AlertTriangle,
            message: "Further evaluation needed to discuss risks vs benefit of thrombolytic therapy",
        }
        : anyTrue
            ? {
                color: "amber",
                icon: AlertTriangle,
                message:
                    "Further evaluation required – correct or weigh risk/benefit before proceeding.",
            }
            : {
                color: "green",
                icon: CheckCircle,
                message: "All criteria satisfied – consider thrombolytic therapy.",
            };

    /*******************************
     * Render helpers
     ******************************/
    const QuestionRow = ({
        id,
        label,
        checked,
        onChange,
        highlight,
        link,
    }: {
        id: keyof EligibilityAnswers;
        label: string;
        checked: boolean;
        onChange: (v: boolean) => void;
        highlight?: "red" | "amber";
        link?: string;
    }) => (
        <div
            className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${checked
                ? highlight === "red"
                    ? "border-red-400 bg-red-50"
                    : "border-amber-400 bg-amber-50"
                : "border-gray-200 hover:border-blue-300"
                }`}
        >
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(v) => onChange(v === true)}
                className="mt-1"
            />
            <Label htmlFor={id} className="flex-1 cursor-pointer text-sm leading-snug">
                {label}
                {link && (
                    <Link
                        href={link}
                        target="_blank"
                        className="ml-2 text-blue-600 underline hover:text-blue-800"
                    >
                        PDF
                    </Link>
                )}
            </Label>
        </div>
    );

    /*******************************
     * JSX
     ******************************/
    return (
        <Card className="mb-10 border border-harbor-gray bg-white shadow-md">
            {/* Header */}
            <CardHeader className="bg-clinical-slate text-parchment">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Shield className="h-5 w-5" /> Eligibility Screening
                </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="space-y-8 p-6">
                {/* 1️⃣ Absolute Exclusions */}
                <section className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Any “Yes” answer immediately excludes thrombolytic therapy.
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                        {ABSOLUTE_Q.map((q) => (
                            <QuestionRow
                                key={q.key}
                                id={q.key}
                                label={q.label}
                                checked={answers[q.key]}
                                onChange={(v) => update(q.key, v)}
                                highlight="red"
                            />
                        ))}
                    </div>
                </section>

                {/* 2️⃣ Vital Parameters */}
                <section className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Must be corrected before thrombolytic consideration. Uncheck after
                        correction.
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                        {VITALS_Q.map((q) => (
                            <QuestionRow
                                key={q.key}
                                id={q.key}
                                label={q.label}
                                checked={answers[q.key]}
                                onChange={(v) => update(q.key, v)}
                                highlight="amber"
                                link={q.link}
                            />
                        ))}
                    </div>
                </section>

                {/* 3️⃣ Medications */}
                <section className="space-y-4">
                    <QuestionRow
                        id="onMedications"
                        label="Currently taking anticoagulants or antiplatelet agents?"
                        checked={answers.onMedications}
                        onChange={(v) => update("onMedications", v)}
                        highlight="amber"
                    />

                    <Collapsible open={showMeds} onOpenChange={setShowMeds}>
                        <CollapsibleTrigger className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                            {showMeds ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            View detailed list
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4 space-y-4">
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
                                <p className="font-semibold">High‑Risk Oral Anticoagulants</p>
                                <p>
                                    Warfarin(Coumadin) · Apixaban(Eliquis) · Rivaroxaban(Xarelto) · Dabigatran(Pradaxa) · Edoxaban(Savaysa) · Betrixaban(Bevyxxa)
                                </p>
                            </div>
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
                                <p className="font-semibold">Injectable Anticoagulants</p>
                                <p>Enoxaparin(Lovenox)  · Dalteparin(Fragmin) · Fondaparinux(Arixtra) · Unfractionated Heparin</p>
                            </div>
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-xs text-yellow-800">
                                <p className="font-semibold">Antiplatelet Agents</p>
                                <p>
                                    Aspirin · Clopidogrel · Ticagrelor · Prasugrel · Dipyridamole/Aspirin · Ticlopidine
                                </p>
                            </div>
                            <p className="text-xs text-gray-600">
                                <strong>Clinical note:</strong> Patients on these agents may require labs (INR, aPTT,
                                anti‑Xa) &amp; physician consultation before thrombolysis.
                            </p>
                        </CollapsibleContent>
                    </Collapsible>
                </section>

                {/* 4️⃣ Other Contra‑indications */}
                <section className="space-y-4">

                    <QuestionRow
                        id="contraindications"
                        label="Any known contraindication to receiving a thrombolytic?"
                        checked={answers.contraindications}
                        onChange={(v) => update("contraindications", v)}
                        highlight="amber"
                    />
                    <Collapsible open={showOtherCI} onOpenChange={setShowOtherCI}>
                        <CollapsibleTrigger className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                            {showOtherCI ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            View full inclusion / exclusion tree
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 text-sm">
                            <Link
                                href="/pdfs/stroke_tpa_decision_tree.pdf"
                                target="_blank"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                Open PDF decision tree
                            </Link>
                        </CollapsibleContent>
                    </Collapsible>
                </section>

                {/* ⚡ Summary banner */}
                <Alert className={`border-${summary.color}-300 bg-${summary.color}-50`}>
                    <summary.icon className={`h-5 w-5 text-${summary.color}-600`} />
                    <AlertTitle className={`font-semibold text-${summary.color}-800`}>
                        Assessment
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                        {summary.message}
                    </AlertDescription>
                </Alert>

                {/* Navigation */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    {onBack && (
                        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
                            Back
                        </Button>
                    )}

                    <Button
                        onClick={onNext}
                        disabled={disabledNext}
                        className="w-full sm:w-auto"
                    >
                        Consider Thrombolytic Therapy ➜
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
