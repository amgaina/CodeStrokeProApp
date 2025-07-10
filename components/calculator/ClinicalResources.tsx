"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    BookOpen,
    AlertTriangle,
    Activity,
    Heart,
    Shield,
    Users,
    Stethoscope,
    BookMarked,
} from "lucide-react";
import { PDFLink } from "../PDFLink";

interface ClinicalResourcesProps {
    onRestart: () => void;
    onBack?: () => void;
    compact?: boolean;
}

export default function ClinicalResources({
    onRestart,
    onBack,
}: ClinicalResourcesProps) {
    const clinicalResources = [
        {
            filename: "post-thrombolytic-monitoring.pdf",
            title: "Post-Thrombolytic Monitoring Guidelines",
            description:
                "Comprehensive monitoring protocols after thrombolytic therapy",
            category: "Monitoring",
            icon: Activity,
        },
        {
            filename: "antihypertensives.pdf",
            title: "BP Management & Antihypertensive Use",
            description:
                "Blood pressure management strategies and antihypertensive protocols",
            category: "Management",
            icon: Heart,
        },
        {
            filename:
                "acute-management-of-hemorrhagic-stroke-and-post-tpa-hemorrhagic-conversion.pdf",
            title: "Hemorrhagic Stroke & Post-TPA Conversion Management",
            description:
                "Management of hemorrhagic conversion and cerebral edema",
            category: "Emergency",
            icon: AlertTriangle,
        },
        {
            filename: "tpa-assocaited-angioedema-management.pdf",
            title: "TPA-Associated Angioedema Management",
            description: "Management protocols for TPA-induced angioedema",
            category: "Emergency",
            icon: AlertTriangle,
        },
        {
            filename:
                "management-of--tia-and-patients-ineligible-for-thrombolytic-therapy-and-secondary-stroke-prevention.pdf",
            title: "TIA & Ineligible Patient Management",
            description:
                "Management of TIA and secondary stroke prevention protocols",
            category: "Management",
            icon: Stethoscope,
        },
        {
            filename: "supportive-care.pdf",
            title: "Supportive Care Guidelines",
            description:
                "Comprehensive supportive care protocols for stroke patients",
            category: "Care",
            icon: Shield,
        },
        {
            filename: "alteplase.pdf",
            title: "Alteplase Guidelines",
            description: "Detailed protocols for alteplase administration",
            category: "Medication",
            icon: BookMarked,
        },
        {
            filename: "tenecteplase.pdf",
            title: "Tenecteplase Guidelines",
            description: "Detailed protocols for tenecteplase administration",
            category: "Medication",
            icon: BookMarked,
        },
        {
            filename: "validated-stroke-assessment-tools.pdf",
            title: "Validated Stroke Assessment Tools",
            description:
                "Evidence-based assessment tools for stroke evaluation",
            category: "Assessment",
            icon: FileText,
        },
    ];

    const additionalResources = [
        {
            filename:
                "additional-resources--badge-buddies--and-auxilliary-labels.pdf",
            title: "Additional Resources & Badge Buddies",
            description: "Quick reference materials and auxiliary labels",
            category: "Printables",
        },
        {
            filename: "ems-tipsheet.pdf",
            title: "EMS Tipsheet",
            description: "Emergency medical services quick reference guide",
            category: "EMS",
        },
        {
            filename:
                "patient-education-and-counseling-for-thrombolytic-therapy.pdf",
            title: "Patient Education & Counseling",
            description: "Patient education materials for thrombolytic therapy",
            category: "Education",
        },
        {
            filename: "inclusion-and-exclusion-criteria-decision-tree.pdf",
            title: "Inclusion & Exclusion Criteria Decision Tree",
            description: "Decision tree for thrombolytic therapy eligibility",
            category: "Assessment",
        },
    ];

    return (
        <div className="space-y-4 md:space-y-6">
            <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
                <CardHeader className="bg-clinical-slate text-parchment p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                        Clinical Resources & Guidelines
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                    {/* Clinical Guidelines Section */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="text-center">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                                Essential Clinical Guidelines
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Evidence-based protocols for stroke management
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {clinicalResources.map((resource, index) => {
                                const IconComponent = resource.icon;
                                return (
                                    <div
                                        key={index}
                                        className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-clinical-slate/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-clinical-slate" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs bg-clinical-slate/10 text-clinical-slate px-2 py-1 rounded">
                                                        {resource.category}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-gray-800 text-sm mb-1">
                                                    {resource.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 mb-3">
                                                    {resource.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <PDFLink
                                                filename={resource.filename}
                                                title={resource.title}
                                                variant="button"
                                                showDownload={true}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Additional Resources Section */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="text-center">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                                Additional Resources & Printables
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Quick reference materials and educational
                                resources
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {additionalResources.map((resource, index) => (
                                <div
                                    key={index}
                                    className="p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-vital-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-4 h-4 md:w-5 md:h-5 text-vital-green" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs bg-vital-green/10 text-vital-green px-2 py-1 rounded">
                                                    {resource.category}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-gray-800 text-sm mb-1">
                                                {resource.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 mb-3">
                                                {resource.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <PDFLink
                                            filename={resource.filename}
                                            title={resource.title}
                                            variant="button"
                                            showDownload={true}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        {onBack && (
                            <Button
                                onClick={onBack}
                                variant="outline"
                                className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                            >
                                Back to Dosing
                            </Button>
                        )}
                        <Button
                            onClick={onRestart}
                            className={`bg-vital-green hover:bg-vital-green/90 text-white text-base md:text-lg px-6 md:px-8 py-2 md:py-3 ${
                                onBack ? "w-full sm:w-auto" : "w-full"
                            }`}
                        >
                            {onBack ? "Start New Case" : "Go to Calculator"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
