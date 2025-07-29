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
