import SectionA from "@/components/home/sectionA";
import SectionB from "@/components/home/sectionB"

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-parchment">
            {/* Main Content */}
            <main className="flex-grow">
                {/* Apply the base animation class to the first section */}
                <div className="animate-fade-in-up animation-delay-1">
                    <SectionA />
                </div>

                {/* Apply the base and a delay class to the second section */}
                <div className="animate-fade-in-up animation-delay-2">
                    <SectionB />
                </div>
            </main>
        </div>
    );
}