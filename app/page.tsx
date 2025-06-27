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
                            <h1 className="text-2xl font-medium text-parchment">
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
                {/* Mission Section - NGO/Service-Oriented Theme */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-lg font-medium text-vital-green mb-2">
                            A Public Service Initiative
                        </p>
                        <h2 className="text-4xl md:text-5xl font-medium text-deep-charcoal mb-6">
                            Serving Communities Through Better Stroke Care
                        </h2>
                        <p className="text-xl text-deep-charcoal/70 max-w-3xl mx-auto mb-10">
                            CodeStroke Pro is a non-commercial clinical decision
                            support tool developed to serve healthcare providers
                            and improve patient outcomes in acute stroke care.
                            Our mission is to enhance community health through
                            accessible, evidence-based tools that support timely
                            and effective treatment decisions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-clinical-slate hover:bg-clinical-slate/90 text-parchment px-8 py-4 text-lg clarity-shadow"
                            >
                                <Link href="/calculator">
                                    Begin Clinical Workflow
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
                                    Clinical Resources
                                    <BookOpen className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>

                        {/* Service Impact Banner */}
                        <div className="mt-12 bg-gradient-to-r from-vital-green/10 to-clinical-slate/10 border border-vital-green/20 rounded-lg p-6 clarity-shadow">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                                <div className="flex items-center gap-3">
                                    <div className="bg-vital-green/20 p-2 rounded-full">
                                        <Activity className="h-5 w-5 text-vital-green" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-deep-charcoal">
                                            Community Focus
                                        </p>
                                        <p className="text-xs text-deep-charcoal/70">
                                            Serving Northeast Louisiana
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-clinical-slate/20 p-2 rounded-full">
                                        <Shield className="h-5 w-5 text-clinical-slate" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-deep-charcoal">
                                            Non-Commercial
                                        </p>
                                        <p className="text-xs text-deep-charcoal/70">
                                            Open Access Tool
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-vital-green/20 p-2 rounded-full">
                                        <Stethoscope className="h-5 w-5 text-vital-green" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-deep-charcoal">
                                            Evidence-Based
                                        </p>
                                        <p className="text-xs text-deep-charcoal/70">
                                            Clinical Guidelines
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workflow Section - Clinical Theme */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-medium text-deep-charcoal mb-4">
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

                {/* About Section - NGO/Service-Oriented Theme */}
                <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-medium text-deep-charcoal mb-4">
                                About This Project
                            </h2>
                            <p className="text-lg text-deep-charcoal/70 mb-8 max-w-3xl mx-auto">
                                CodeStroke Pro is a non-commercial, open-access
                                clinical decision support tool developed to
                                serve healthcare providers and improve patient
                                outcomes in acute stroke care.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            {/* Mission Statement */}
                            <div className="bg-white border border-harbor-gray rounded-lg p-6 clarity-shadow">
                                <h3 className="text-xl font-medium text-deep-charcoal mb-4 flex items-center">
                                    <Activity className="h-5 w-5 text-vital-green mr-2" />
                                    Our Mission
                                </h3>
                                <p className="text-deep-charcoal/70 mb-4">
                                    This tool was developed to improve the
                                    efficiency and safety of acute stroke care
                                    by providing an intuitive, evidence-based
                                    decision support system. Our goal is to
                                    reduce cognitive load on healthcare
                                    providers during critical, time-sensitive
                                    situations.
                                </p>
                                <p className="text-deep-charcoal/70">
                                    This project supports the mission of the ULM
                                    College of Pharmacy:
                                    <em className="text-vital-green">
                                        {" "}
                                        "Enhancing the health and environment of
                                        the communities we serve."
                                    </em>
                                </p>
                            </div>

                            {/* Development Team */}
                            <div className="bg-white border border-harbor-gray rounded-lg p-6 clarity-shadow">
                                <h3 className="text-xl font-medium text-deep-charcoal mb-4 flex items-center">
                                    <Stethoscope className="h-5 w-5 text-vital-green mr-2" />
                                    Development Team
                                </h3>
                                <p className="text-deep-charcoal/70 mb-4">
                                    This project was created by faculty members
                                    at the University of Louisiana at Monroe
                                    College of Pharmacy, with a focus on
                                    translating clinical expertise into
                                    practical tools for healthcare providers.
                                </p>
                                <p className="text-deep-charcoal/70">
                                    This tool is provided for educational and
                                    clinical support purposes only and is not
                                    intended for commercial use. All development
                                    efforts are aligned with our institutional
                                    commitment to public service and community
                                    health.
                                </p>
                            </div>
                        </div>

                        {/* Grant Support Section */}
                        <div className="bg-gradient-to-r from-vital-green/5 to-clinical-slate/5 border border-vital-green/20 rounded-lg p-8 mb-8 clarity-shadow">
                            <h3 className="text-2xl font-medium text-deep-charcoal mb-6 text-center">
                                Grant Support & Community Partnership
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-white/80 rounded-lg p-6 border border-harbor-gray/30">
                                    <h4 className="text-lg font-medium text-deep-charcoal mb-3">
                                        Living Well Foundation
                                    </h4>
                                    <p className="text-deep-charcoal/70 mb-4">
                                        <strong>
                                            This project was funded (or funded
                                            in part) by a grant from the Living
                                            Well Foundation.
                                        </strong>
                                    </p>
                                    <p className="text-deep-charcoal/70 mb-4">
                                        The Living Well Foundation is a public
                                        non-profit organization dedicated to
                                        enhancing the health, wellness, and
                                        quality of life in northeast Louisiana.
                                        Founded in 2006, the Living Well
                                        Foundation serves the residents of
                                        Caldwell, Franklin, Jackson, Lincoln,
                                        Morehouse, Ouachita, Richland, and Union
                                        Parishes.
                                    </p>
                                    <p className="text-deep-charcoal/70">
                                        For more information about the
                                        Foundation, visit:{" "}
                                        <a
                                            href="https://www.livingwellfoundation.net"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-vital-green hover:text-vital-green/80 underline font-medium"
                                        >
                                            www.livingwellfoundation.net
                                        </a>
                                    </p>
                                </div>

                                <div className="bg-white/80 rounded-lg p-6 border border-harbor-gray/30">
                                    <h4 className="text-lg font-medium text-deep-charcoal mb-3">
                                        University of Louisiana at Monroe
                                        College of Pharmacy
                                    </h4>
                                    <p className="text-deep-charcoal/70">
                                        This project was created by faculty
                                        members at University of Louisiana at
                                        Monroe College of Pharmacy and supports
                                        the mission of the ULM College of
                                        Pharmacy in enhancing the health and
                                        environment of the communities we serve.
                                    </p>
                                </div>
                            </div>
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
                            <h2 className="text-3xl md:text-4xl font-medium text-deep-charcoal mb-4">
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

            {/* Footer - Clinical Theme with Comprehensive Legal Disclaimer */}
            <footer className="w-full bg-harbor-gray/10 border-t border-harbor-gray mt-auto">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white border border-red-500/30 rounded-lg p-8 mb-8 clarity-shadow">
                        <div className="flex items-start mb-6">
                            <AlertTriangle className="h-6 w-6 text-red-500 mr-4 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h3 className="text-xl font-medium text-deep-charcoal mb-4">
                                    Legal Disclaimer
                                </h3>
                                <div className="space-y-4 text-sm text-deep-charcoal/70">
                                    <p>
                                        <strong>
                                            This application is provided as a
                                            clinical support and educational
                                            tool only.
                                        </strong>{" "}
                                        It is designed to assist qualified
                                        healthcare professionals in managing
                                        time-sensitive decisions in acute stroke
                                        care but is not a substitute for
                                        independent clinical judgment,
                                        institutional protocols, or the standard
                                        of care.
                                    </p>

                                    <p>
                                        <strong>
                                            This information is current as of
                                            06/26/2025.
                                        </strong>{" "}
                                        While reasonable efforts are made to
                                        maintain the accuracy and relevance of
                                        the information presented, it is the
                                        responsibility of the prescriber and
                                        care team to verify all data and ensure
                                        appropriate treatment is provided.
                                    </p>

                                    <div>
                                        <p className="font-medium text-deep-charcoal mb-2">
                                            By using this application, you
                                            acknowledge that:
                                        </p>
                                        <ul className="space-y-2 ml-4">
                                            <li className="flex items-start">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span>
                                                    The app does not make
                                                    treatment decisions and is
                                                    not a source of medical
                                                    advice.
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span>
                                                    The app provides guidance
                                                    only, based on user-input
                                                    data and current evidence or
                                                    clinical standards as of the
                                                    noted date.
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span>
                                                    Ultimate responsibility for
                                                    patient care remains solely
                                                    with the treating
                                                    provider(s).
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span>
                                                    With the appropriate
                                                    disclaimers in place, the
                                                    liability of the developers
                                                    and affiliated institutions
                                                    is considered to be very
                                                    low. The developers and
                                                    institutions assume no
                                                    liability for any direct or
                                                    indirect damages, injuries,
                                                    or outcomes resulting from
                                                    use or reliance on this
                                                    tool.
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span>
                                                    <strong>
                                                        By continuing, you
                                                        acknowledge and accept
                                                        these terms.
                                                    </strong>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="text-xs text-deep-charcoal/60 mt-6 pt-4 border-t border-harbor-gray/30">
                                        All patient data entered is processed
                                        locally and is not stored or
                                        transmitted. This tool is intended for
                                        use by licensed healthcare professionals
                                        as a decision support aid.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-deep-charcoal/60 space-y-2">
                        <p className="text-sm">
                            Developed by University of Louisiana at Monroe
                            College of Pharmacy
                        </p>
                        <p className="text-sm">
                            Funded by the Living Well Foundation
                        </p>
                        <p className="text-xs">
                            &copy; {new Date().getFullYear()} CodeStroke Pro. A
                            public service initiative.
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
