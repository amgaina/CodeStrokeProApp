import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    BookOpen,
    AlertTriangle,
    Activity,
    Heart,
    Shield,
    Stethoscope,
    BookMarked,
} from "lucide-react";
import { PDFLink } from "@/components/PDFLink";
import Link from "next/link";

export default function ResourcesPage() {
    const resources = [
        {
            filename:
                "additional-resources--badge-buddies--and-auxilliary-labels.pdf",
            title: "Additional Resources and Printables",
            description:
                "Additional Resources, Badge Buddies, and auxiliary labels",
            category: "Printables",
            icon: FileText,
        },
        {
            filename: "post-thrombolytic-monitoring.pdf",
            title: "Post-thrombolytic monitoring guidelines",
            description: "Post Thrombolytic Monitoring protocols",
            category: "Monitoring",
            icon: Activity,
        },
        {
            filename: "antihypertensives.pdf",
            title: "BP management & antihypertensive use",
            description:
                "Blood pressure management strategies and antihypertensive protocols",
            category: "Management",
            icon: Heart,
        },
        {
            filename:
                "acute-management-of-hemorrhagic-stroke-and-post-tpa-hemorrhagic-conversion.pdf",
            title: "Signs of hemorrhagic conversion Cerebral edema or ICH management",
            description:
                "Acute management of hemorrhagic stroke and post-TPA hemorrhagic conversion",
            category: "Emergency",
            icon: AlertTriangle,
        },
        {
            filename: "tpa-assocaited-angioedema-management.pdf",
            title: "Management of TPA-Induced Angioedema",
            description: "Management protocols for TPA-induced angioedema",
            category: "Emergency",
            icon: AlertTriangle,
        },
        {
            filename:
                "management-of--tia-and-patients-ineligible-for-thrombolytic-therapy-and-secondary-stroke-prevention.pdf",
            title: "Management of TIA and Patient's Ineligible For Thrombolytic Therapy and Secondary Stroke Prevention",
            description:
                "Management of TIA and secondary stroke prevention protocols",
            category: "Management",
            icon: Stethoscope,
        },
        {
            filename: "supportive-care.pdf",
            title: "Supportive Care",
            description:
                "Comprehensive supportive care protocols for stroke patients",
            category: "Care",
            icon: Shield,
        },
        {
            filename:
                "additional-resources--badge-buddies--and-auxilliary-labels.pdf",
            title: "Printables",
            description:
                "Additional Resources, Badge Buddies, and auxiliary labels",
            category: "Printables",
            icon: FileText,
        },
        {
            filename: "ems-tipsheet.pdf",
            title: "EMS Tipsheet",
            description: "Emergency medical services quick reference guide",
            category: "EMS",
            icon: Stethoscope,
        },
        {
            filename:
                "patient-education-and-counseling-for-thrombolytic-therapy.pdf",
            title: "For Patients: Patient Education and Counseling for Thrombolytic Therapy",
            description: "Patient education materials for thrombolytic therapy",
            category: "Education",
            icon: BookOpen,
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
            filename: "inclusion-and-exclusion-criteria-decision-tree.pdf",
            title: "Inclusion & Exclusion Criteria Decision Tree",
            description: "Decision tree for thrombolytic therapy eligibility",
            category: "Assessment",
            icon: FileText,
        },
        {
            filename: "validated-stroke-assessment-tools.pdf",
            title: "Validated Stroke Assessment Tools",
            description:
                "Evidence-based assessment tools for stroke evaluation",
            category: "Assessment",
            icon: FileText,
        },
        {
            filename: "wake-up-stroke.pdf",
            title: "Wake-Up Stroke Protocol",
            description:
                "Wake-up stroke assessment and management: Quick Guide",
            category: "Essentials",
            icon: FileText,
        },
    ];

    return (
        <div className="min-h-screen bg-parchment">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-4">
                        Clinical Resources & Guidelines
                    </h1>
                    <p className="text-deep-charcoal/70 text-lg max-w-3xl mx-auto">
                        Comprehensive collection of evidence-based stroke care
                        protocols, monitoring guidelines, and educational
                        resources for healthcare professionals.
                    </p>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
                        <CardHeader className="bg-clinical-slate text-parchment p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                                Clinical Resources & Guidelines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                            {/* All Resources Section */}
                            <div className="space-y-3 md:space-y-4">
                                <div className="text-center">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                                        Clinical Resources & Guidelines
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Evidence-based protocols for stroke
                                        management and care
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {resources.map((resource, index) => {
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
                                                                {
                                                                    resource.category
                                                                }
                                                            </span>
                                                        </div>
                                                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                                                            {resource.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-600 mb-3">
                                                            {
                                                                resource.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    <PDFLink
                                                        filename={
                                                            resource.filename
                                                        }
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

                            {/* Navigation Button */}
                            <div className="flex justify-center">
                                <Link href="/calculator">
                                    <Button className="bg-vital-green hover:bg-vital-green/90 text-white text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto">
                                        Go to Calculator
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medication Preparation Videos */}
                    <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
                        <CardHeader className="bg-clinical-slate text-parchment p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                                Medication Preparation Videos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                            <div className="space-y-3 md:space-y-4">
                                <div className="text-center">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                                        Medication Preparation Videos
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Step-by-step video guides for preparing
                                        stroke medications.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Alteplase Video */}
                                    <div className="p-3 md:p-4 border-2 border-gray-200 rounded-lg bg-white">
                                        <h4 className="font-semibold text-gray-800 text-sm mb-2">
                                            Alteplase Preparation How-to Video
                                        </h4>
                                        <div className="w-full rounded mb-2 overflow-hidden">
                                            <iframe
                                                src="https://ulmwarhawks-my.sharepoint.com/personal/emmcgee_ulm_edu/_layouts/15/embed.aspx?UniqueId=fef61651-fa72-4dc7-87c8-c6f54fc4fcd4&embed=%7B%22ust%22%3Afalse%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create"
                                                width="100%"
                                                height="360"
                                                frameBorder="0"
                                                scrolling="no"
                                                allowFullScreen
                                                title="Alteplase Preparation How to Video.mp4"
                                            ></iframe>
                                        </div>
                                    </div>
                                    {/* TNK Video */}
                                    <div className="p-3 md:p-4 border-2 border-gray-200 rounded-lg bg-white">
                                        <h4 className="font-semibold text-gray-800 text-sm mb-2">
                                            Tenecteplase (TNK) Preparation
                                            How-to Video
                                        </h4>
                                        <div className="w-full rounded mb-2 overflow-hidden">
                                            <iframe
                                                src="https://ulmwarhawks-my.sharepoint.com/personal/emmcgee_ulm_edu/_layouts/15/embed.aspx?UniqueId=f8b7799a-06d4-4fe4-8f28-4901f9b0351a&embed=%7B%22ust%22%3Afalse%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create"
                                                width="100%"
                                                height="360"
                                                frameBorder="0"
                                                scrolling="no"
                                                allowFullScreen
                                                title="TNK prep how to.mp4"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
