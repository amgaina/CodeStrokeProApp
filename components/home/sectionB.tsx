import {
    Brain,
    ActivitySquare,
    ChevronRight,
    Clock,
    Calculator,
    Gauge,
    BarChart,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ToolButton Component
function ToolButton({
    href,
    icon,
    iconBg,
    iconColor,
    name,
    description,
    tag,
}: {
    href: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    name: string;
    description: string;
    tag: string;
}) {
    return (
        <Link href={href} className="block hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 flex items-center">
                <div
                    className={`${iconBg} ${iconColor} w-10 h-10 rounded-md flex items-center justify-center mr-4`}
                >
                    {icon}
                </div>
                <div className="flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-medium text-clinical-slate">
                            {name}
                        </h4>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                            {tag}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
                <div className="ml-2">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
            </div>
        </Link>
    );
}

// FeatureChip Component
function FeatureChip({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2 bg-gray-50 rounded-md p-2 border border-gray-200">
            <div className="text-clinical-slate">{icon}</div>
            <span className="text-sm text-gray-700">{label}</span>
        </div>
    );
}

export default function ClinicalTheme() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-medium text-clinical-slate mb-4">
                        Integrated Clinical Workflow
                    </h2>
                    <p className="text-lg text-clinical-slate/70 max-w-3xl mx-auto">
                        Each component is designed to support rapid,
                        evidence-based decision-making in acute stroke care.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Left Column - Stroke Scales */}
                    <Card className="border border-gray-200 overflow-hidden bg-white shadow-sm h-full">
                        <CardHeader className="bg-vital-green/10 border-b border-vital-green/20 py-3">
                            <CardTitle className="text-lg font-medium text-clinical-slate flex items-center gap-2">
                                <Gauge className="h-5 w-5 text-vital-green" />
                                Stroke Assessment Tools
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 divide-y divide-gray-100">
                                {/* NIHSS */}
                                <ToolButton
                                    href="/nihss"
                                    icon={<BarChart className="h-5 w-5" />}
                                    iconColor="text-violet-600"
                                    iconBg="bg-violet-100"
                                    name="NIH Stroke Scale (NIHSS)"
                                    description="Comprehensive 11-item neurological exam"
                                    tag="Complete Assessment"
                                />

                                {/* Cincinnati Stroke Scale */}
                                <ToolButton
                                    href="/cpss"
                                    icon={
                                        <ActivitySquare className="h-5 w-5" />
                                    }
                                    iconColor="text-amber-600"
                                    iconBg="bg-amber-100"
                                    name="Cincinnati Stroke Scale"
                                    description="3-question assessment for rapid stroke detection"
                                    tag="Quick Screen"
                                />

                                {/* VAN Assessment */}
                                <ToolButton
                                    href="/van"
                                    icon={<Brain className="h-5 w-5" />}
                                    iconColor="text-red-600"
                                    iconBg="bg-red-100"
                                    name="VAN Assessment"
                                    description="LVO detection using Vision, Aphasia, and Neglect"
                                    tag="LVO Detection"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column - Unified Calculator */}
                    <Card className="border border-gray-200 overflow-hidden bg-white shadow-sm h-full">
                        <CardHeader className="bg-clinical-slate/10 border-b border-clinical-slate/20 py-3">
                            <CardTitle className="text-lg font-medium text-clinical-slate flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-clinical-slate" />
                                Stroke Treatment Tools
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-4">
                            <div className="flex flex-col h-full">
                                {/* Full Calculator Description */}
                                <div className="mb-4">
                                    <h3 className="text-base font-medium text-deep-charcoal mb-2">
                                        Integrated Calculator
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Our comprehensive calculator guides you
                                        through the complete stroke treatment
                                        workflow, from time tracking to dosage
                                        calculation.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    {/* Time Tracking Feature */}
                                    <FeatureChip
                                        icon={<Clock className="h-4 w-4" />}
                                        label="LKW & Door-to-Needle Timers"
                                    />

                                    {/* Eligibility Screening */}
                                    <FeatureChip
                                        icon={
                                            <ChevronRight className="h-4 w-4" />
                                        }
                                        label="Eligibility Screening"
                                    />

                                    {/* Medication Selection */}
                                    <FeatureChip
                                        icon={
                                            <ChevronRight className="h-4 w-4" />
                                        }
                                        label="Medication Selection"
                                    />

                                    {/* Dosage Calculation */}
                                    <FeatureChip
                                        icon={
                                            <Calculator className="h-4 w-4" />
                                        }
                                        label="Weight-Based Dosing"
                                    />
                                </div>

                                {/* Call to action */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                                    <Link
                                        href="/calculator"
                                        className="flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-clinical-slate text-white rounded-md shadow-sm hover:bg-clinical-slate/90 transition-colors"
                                    >
                                        Start Full Workflow
                                    </Link>
                                    <Link
                                        href="/fast-calc"
                                        className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-clinical-slate text-clinical-slate rounded-md shadow-sm hover:bg-clinical-slate/10 transition-colors"
                                    >
                                        Quick Dosing Only
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Resources Link */}
                <div className="flex justify-center">
                    <Link
                        href="/resources"
                        className="inline-flex items-center px-4 py-2 text-clinical-slate rounded-md border border-clinical-slate/30 hover:bg-clinical-slate/5 transition-colors"
                    >
                        <span className="mr-2">
                            View additional clinical resources
                        </span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

// Clinical Tool Item Component
function ClinicalToolItem({
    href,
    icon,
    iconBg,
    iconColor,
    title,
    description,
    tag,
    tagColor,
    metric,
    time,
    priority,
}: {
    href: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
    tag: string;
    tagColor: string;
    metric: string;
    time: string;
    priority?: "high" | "medium" | "low";
}) {
    return (
        <Link href={href} className="block group">
            <div className="px-4 py-4 hover:bg-gray-50 flex items-center transition-colors">
                {/* Left - Icon */}
                <div
                    className={`${iconBg} ${iconColor} w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 mr-4 group-hover:scale-105 transition-transform`}
                >
                    {icon}
                </div>

                {/* Middle - Title, description, tag */}
                <div className="flex-grow">
                    <div className="flex items-center flex-wrap gap-2">
                        <h4 className="text-base font-medium text-deep-charcoal group-hover:text-clinical-slate">
                            {title}
                        </h4>
                        <span
                            className={`inline-flex text-xs px-2 py-0.5 rounded-full border ${tagColor}`}
                        >
                            {tag}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>

                {/* Right - Metrics & action */}
                <div className="flex-shrink-0 ml-4 flex items-center gap-4">
                    {/* Metrics */}
                    <div className="hidden md:block text-right">
                        <div className="text-xs text-gray-500 mb-1">{time}</div>
                        <div className="text-xs font-medium text-gray-700">
                            {metric}
                        </div>
                    </div>

                    {/* Action indicator */}
                    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-clinical-slate/80 group-hover:border-clinical-slate transition-colors">
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
