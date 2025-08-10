import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { PDFLink } from "@/components/PDFLink";
import Link from "next/link";
import { resources, videos } from "@/lib/resources";
import { BookOpen } from "lucide-react";

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-parchment animate-fade-in-up animation-delay-1">
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
                                    {videos.map((video, index) => (
                                        <div
                                            key={index}
                                            className="p-3 md:p-4 border-2 border-gray-200 rounded-lg bg-white"
                                        >
                                            <h4 className="font-semibold text-gray-800 text-sm mb-2">
                                                {video.title}
                                            </h4>
                                            <div className="w-full rounded mb-2 overflow-hidden">
                                                <iframe
                                                    src={video.src}
                                                    width="100%"
                                                    height="320"
                                                    frameBorder="0"
                                                    scrolling="no"
                                                    allowFullScreen
                                                    title={video.alt}
                                                ></iframe>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
