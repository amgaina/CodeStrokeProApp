
import {
    Activity,
    ChevronRight,
    FileText,
    AlertTriangle,
    Stethoscope,
} from "lucide-react";
import SectionA from "@/components/home/sectionA";
import SectionB from "@/components/home/sectionB"

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-parchment">
            {/* Main Content */}
            <main className="flex-grow">
                {/* Mission Section - NGO/Service-Oriented Theme */}
                <SectionA />
                {/* Workflow Section - Clinical Theme */}
                <SectionB />
            </main>
        </div>
    );
}

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
