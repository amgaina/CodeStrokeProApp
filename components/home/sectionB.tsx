import {
    Clock,
    Shield,
    Calculator,
} from "lucide-react";
import FeatureCard from "../featureCard";

export default function ClinicalTheme() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-medium text-clinical-slate mb-4">
                        Integrated Clinical Workflow
                    </h2>
                    <p className="text-lg text-deep-charcoal/70 max-w-3xl mx-auto">
                        Each component is designed to support rapid,
                        evidence-based decision-making in acute stroke
                        care.
                    </p>
                </div>
                <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={
                            <Clock className="h-7 w-7 text-clinical-slate" />
                        }
                        title="LKW & Code Stroke Timers"
                        description="Simultaneously track Last Known Well and Door-to-Needle times to ensure timely treatment."
                    />
                    <FeatureCard
                        icon={
                            <Shield className="h-7 w-7 text-clinical-slate" />
                        }
                        title="Eligibility Screening"
                        description="Navigate a comprehensive checklist of inclusion and exclusion criteria for thrombolysis."
                    />
                    <FeatureCard
                        icon={
                            <Calculator className="h-7 w-7 text-clinical-slate" />
                        }
                        title="TNK/Alteplase Dosing"
                        description="Calculate precise, weight-based dosing for Tenecteplase or Alteplase, including bolus and infusion rates."
                    />
                </div>
            </div>
        </section>
    )
}