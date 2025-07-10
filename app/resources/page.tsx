import PDFLink from "@/components/PDFLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, AlertCircle } from "lucide-react";

export default function ResourcesPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-deep-charcoal mb-2">
                    Clinical Resources
                </h1>
                <p className="text-deep-charcoal/70">
                    Access important stroke care protocols and reference
                    materials
                </p>
            </div>

            <div className="grid gap-6">
                {/* Stroke Protocols */}
                <Card className="clarity-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-critical-crimson" />
                            Stroke Protocols
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PDFLink
                            filename="acute-stroke-protocol.pdf"
                            title="Acute Stroke Protocol"
                            description="Complete protocol for acute stroke management"
                            size="2.1 MB"
                            variant="card"
                        />
                        <PDFLink
                            filename="thrombolytic-checklist.pdf"
                            title="Thrombolytic Therapy Checklist"
                            description="Pre-treatment checklist and contraindications"
                            size="1.5 MB"
                            variant="card"
                        />
                    </CardContent>
                </Card>

                {/* Quick Reference */}
                <Card className="clarity-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-vital-green" />
                            Quick Reference
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PDFLink
                            filename="nihss-scale.pdf"
                            title="NIHSS Scale Reference"
                            description="Complete National Institutes of Health Stroke Scale"
                            size="850 KB"
                            variant="card"
                        />
                        <PDFLink
                            filename="drug-dosing-chart.pdf"
                            title="Drug Dosing Chart"
                            description="Quick reference for stroke medication dosing"
                            size="650 KB"
                            variant="card"
                        />
                    </CardContent>
                </Card>

                {/* Educational Materials */}
                <Card className="clarity-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-clinical-slate" />
                            Educational Materials
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PDFLink
                            filename="stroke-recognition-guide.pdf"
                            title="Stroke Recognition Guide"
                            description="Patient and family education materials"
                            size="1.8 MB"
                            variant="card"
                        />
                        <PDFLink
                            filename="post-stroke-care.pdf"
                            title="Post-Stroke Care Guidelines"
                            description="Comprehensive discharge planning guide"
                            size="2.3 MB"
                            variant="card"
                        />
                    </CardContent>
                </Card>

                {/* Simple Links Examples */}
                <Card className="clarity-shadow">
                    <CardHeader>
                        <CardTitle>Alternative Display Styles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">Simple Links:</h3>
                            <div className="space-y-2">
                                <PDFLink
                                    filename="emergency-contacts.pdf"
                                    title="Emergency Contacts"
                                    variant="link"
                                />
                                <PDFLink
                                    filename="lab-values-reference.pdf"
                                    title="Lab Values Reference"
                                    variant="link"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Button Style:</h3>
                            <div className="flex flex-wrap gap-2">
                                <PDFLink
                                    filename="quick-checklist.pdf"
                                    title="Quick Checklist"
                                    variant="button"
                                />
                                <PDFLink
                                    filename="medication-guide.pdf"
                                    title="Medication Guide"
                                    variant="button"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
