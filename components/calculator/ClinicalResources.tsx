"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Eye, Users } from "lucide-react";

interface ClinicalResourcesProps {
    onRestart: () => void;
    onBack?: () => void;
    compact?: boolean;
}

export default function ClinicalResources({
    onRestart,
    onBack,
}: ClinicalResourcesProps) {
    const resources = [
        {
            title: "2019 AHA/ASA Acute Ischemic Stroke Guidelines",
            url: "https://www.ahajournals.org/doi/10.1161/STR.0000000000000211",
            description:
                "Comprehensive guidelines for the early management of acute ischemic stroke",
            category: "Guidelines",
        },
        {
            title: "NINDS Stroke Information",
            url: "https://www.ninds.nih.gov/health-information/disorders/stroke",
            description:
                "National Institute of Neurological Disorders and Stroke resources",
            category: "Education",
        },
        {
            title: "Stroke Quality Measures",
            url: "https://www.strokeassociation.org/en/professional/quality-improvement/quality-measures",
            description: "Quality improvement measures for stroke care",
            category: "Quality",
        },
        {
            title: "Emergency Stroke Care Algorithms",
            url: "https://www.stroke.org/en/professionals/stroke-treatments/emergency-stroke-care",
            description:
                "Step-by-step algorithms for emergency stroke management",
            category: "Protocols",
        },
    ];

    return (
        <div className="space-y-4 md:space-y-6">
            <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                        Clinical Resources & Guidelines
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-8">
                    <div className="space-y-4 md:space-y-6">
                        <div className="text-center">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                                Essential Stroke Care Resources
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Quick access to evidence-based guidelines and
                                protocols
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {resources.map((resource, index) => (
                                <a
                                    key={index}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {resource.category}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                                                {resource.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {resource.description}
                                            </p>
                                        </div>
                                        <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Emergency Contacts */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Emergency Contacts
                            </h4>
                            <div className="space-y-2 text-sm">
                                <p className="text-red-700">
                                    <strong>Stroke Team:</strong> Call stroke
                                    alert per institutional protocol
                                </p>
                                <p className="text-red-700">
                                    <strong>Neurology:</strong> Contact on-call
                                    neurologist immediately
                                </p>
                                <p className="text-red-700">
                                    <strong>Pharmacy:</strong> For drug
                                    preparation and verification
                                </p>
                            </div>
                        </div>

                        {/* Post-Treatment Monitoring */}
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 mb-2">
                                Post-Thrombolytic Monitoring
                            </h4>
                            <div className="space-y-1 text-sm text-yellow-700">
                                <p>
                                    • Neurological assessments every 15 minutes
                                    × 2 hours
                                </p>
                                <p>
                                    • Vital signs every 15 minutes × 2 hours,
                                    then every 30 minutes × 6 hours
                                </p>
                                <p>
                                    • Blood pressure management: keep
                                    &lt;180/105 mmHg
                                </p>
                                <p>
                                    • Watch for signs of bleeding or
                                    neurological deterioration
                                </p>
                                <p>
                                    • No anticoagulants or antiplatelets for 24
                                    hours
                                </p>
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
                                className="bg-blue-600 hover:bg-blue-700 text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                            >
                                Start New Case
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
