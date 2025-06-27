import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Clock,
    Shield,
    Calculator,
    BookOpen,
    Activity,
    ChevronRight,
    FileText,
    AlertTriangle,
    Stethoscope,
} from "lucide-react";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-parchment">
            {/* Header - Clinical Theme */}
            <header className="w-full bg-clinical-slate text-parchment clarity-shadow border-b border-harbor-gray sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/10 p-2 rounded-full">
                                <Stethoscope className="h-6 w-6 text-parchment/80" />
                            </div>
                            <h1 className="text-2xl font-bold text-parchment">
                                CodeStroke Pro
                            </h1>
                        </div>
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/calculator"
                                className="text-base text-parchment/80 hover:text-parchment transition-colors"
                            >
                                Calculator
                            </Link>
                            <Link
                                href="#about"
                                className="text-base text-parchment/80 hover:text-parchment transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="#resources"
                                className="text-base text-parchment/80 hover:text-parchment transition-colors"
                            >
                                Resources
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {/* Mission Section - Clinical Theme */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-lg font-semibold text-vital-green mb-2">
                            A Clinical Decision Support Tool
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold text-deep-charcoal mb-6">
                            Acute Stroke Care, Simplified.
                        </h2>
                        <p className="text-xl text-deep-charcoal/70 max-w-3xl mx-auto mb-10">
                            CodeStroke Pro provides healthcare professionals
                            with a streamlined workflow for thrombolytic therapy
                            decisions, integrating timers, eligibility
                            checklists, and dosing calculators based on the
                            latest clinical guidelines.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-clinical-slate hover:bg-clinical-slate/90 text-parchment px-8 py-4 text-lg clarity-shadow"
                            >
                                <Link href="/calculator">
                                    Begin Workflow
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-harbor-gray text-deep-charcoal hover:bg-harbor-gray/20 px-8 py-4 text-lg"
                            >
                                <Link href="#resources">
                                    View Resources
                                    <BookOpen className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Workflow Section - Clinical Theme */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-4">
                                Integrated Clinical Workflow
                            </h2>
                            <p className="text-lg text-deep-charcoal/70 max-w-3xl mx-auto">
                                Each component is designed to support rapid,
                                evidence-based decision-making in acute stroke
                                care.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={
                                    <Clock className="h-7 w-7 text-vital-green" />
                                }
                                title="LKW & Code Stroke Timers"
                                description="Simultaneously track Last Known Well and Door-to-Needle times to ensure timely treatment."
                            />
                            <FeatureCard
                                icon={
                                    <Shield className="h-7 w-7 text-vital-green" />
                                }
                                title="Eligibility Screening"
                                description="Navigate a comprehensive checklist of inclusion and exclusion criteria for thrombolysis."
                            />
                            <FeatureCard
                                icon={
                                    <Calculator className="h-7 w-7 text-vital-green" />
                                }
                                title="TNK/Alteplase Dosing"
                                description="Calculate precise, weight-based dosing for Tenecteplase or Alteplase, including bolus and infusion rates."
                            />
                        </div>
                    </div>
                </section>

                {/* About Section - Clinical Theme */}
                <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-4">
                            About This Project
                        </h2>
                        <p className="text-lg text-deep-charcoal/70 mb-8">
                            CodeStroke Pro is a non-commercial, open-access tool
                            developed to support front-line clinicians.
                        </p>
                        <div className="bg-white border border-harbor-gray rounded-lg p-8 text-left clarity-shadow">
                            <h3 className="text-2xl font-semibold text-deep-charcoal mb-4">
                                Mission and Support
                            </h3>
                            <p className="text-deep-charcoal/70 mb-4">
                                This tool was developed to improve the
                                efficiency and safety of acute stroke care by
                                providing an intuitive, evidence-based decision
                                support system. Our goal is to reduce cognitive
                                load on healthcare providers during critical,
                                time-sensitive situations.
                            </p>
                            <p className="text-deep-charcoal/70">
                                Development was supported by a grant from the
                                Living Well Foundation and aligns with the academic and
                                patient-care missions of our affiliated
                                university medical center. This tool is provided
                                for educational and clinical support purposes
                                only and is not intended for commercial use.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Resources Section - Clinical Theme */}
                <section
                    id="resources"
                    className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm"
                >
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-4">
                                Clinical Resources
                            </h2>
                            <p className="text-lg text-deep-charcoal/70">
                                Quick links to essential stroke care guidelines.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <ResourceLink
                                href="https://www.ahajournals.org/doi/10.1161/STROKEAHA.119.025225"
                                title="2019 AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke"
                            />
                            <ResourceLink
                                href="https://www.stroke.org/-/media/stroke-files/professional-stroke-resource-library/2022-guideline-for-the-management-of-spontaneous-ich.pdf"
                                title="2022 Guideline for the Management of Spontaneous Intracerebral Hemorrhage"
                            />
                            <ResourceLink
                                href="https://www.ninds.nih.gov/"
                                title="National Institute of Neurological Disorders and Stroke (NINDS)"
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Clinical Theme */}
            <footer className="w-full bg-harbor-gray/10 border-t border-harbor-gray mt-auto">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white border border-red-500/30 rounded-lg p-6 mb-8 clarity-shadow">
                        <div className="flex items-start">
                            <AlertTriangle className="h-6 w-6 text-red-500 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-deep-charcoal mb-2">
                                    Legal Disclaimer
                                </h3>
                                <p className="text-sm text-deep-charcoal/70">
                                    This tool is intended for use by licensed
                                    healthcare professionals as a decision
                                    support aid. It is not a substitute for
                                    clinical judgment. The developers assume no
                                    liability for any actions taken based on the
                                    use of this application. All patient data
                                    entered is processed locally and is not
                                    stored or transmitted.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-deep-charcoal/60">
                        <p>
                            &copy; {new Date().getFullYear()} CodeStroke Pro.
                            All Rights Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Helper component for Feature Cards - Clinical Theme
const FeatureCard = ({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) => (
    <Card className="bg-white border-harbor-gray clarity-shadow hover:shadow-lg transition-all duration-300 flex flex-col">
        <CardHeader className="flex-shrink-0">
            <div className="w-14 h-14 bg-vital-green/10 rounded-xl flex items-center justify-center mb-4">
                {icon}
            </div>
            <CardTitle className="text-xl text-deep-charcoal">
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-deep-charcoal/70">{description}</p>
        </CardContent>
    </Card>
);

// Helper component for Resource Links - Clinical Theme
const ResourceLink = ({ href, title }: { href: string; title: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white border border-harbor-gray rounded-lg p-4 hover:bg-harbor-gray/10 transition-colors clarity-shadow"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <FileText className="h-5 w-5 text-vital-green mr-4" />
                <span className="text-base font-medium text-deep-charcoal">
                    {title}
                </span>
            </div>
            <ChevronRight className="h-5 w-5 text-deep-charcoal/60" />
        </div>
    </a>
);
