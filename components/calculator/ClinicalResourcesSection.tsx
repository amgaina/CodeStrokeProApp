// Example of how to add PDF resources to your EligibilityScreening component

import PDFLink from "@/components/PDFLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

// Add this section to your EligibilityScreening component
const ClinicalResourcesSection = () => (
    <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-clinical-slate" />
                Clinical Resources
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <PDFLink
                filename="stroke-eligibility-criteria.pdf"
                title="Stroke Eligibility Criteria"
                description="Complete eligibility guidelines for thrombolytic therapy"
                variant="card"
            />
            <PDFLink
                filename="blood-pressure-management.pdf"
                title="Blood Pressure Management Protocol"
                description="Guidelines for managing BP >185/110 mmHg"
                variant="card"
            />
            <PDFLink
                filename="glucose-management.pdf"
                title="Glucose Management Guidelines"
                description="Protocols for glucose <50 or >400 mg/dL"
                variant="card"
            />
        </CardContent>
    </Card>
);

export default ClinicalResourcesSection;
