import Image from "next/image";
import ULM_LOGO from "@/assets/ulm_logo.png";
import LIVING_WELL_LOGO from "@/assets/LWF_logo.png"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function AboutPage() {
    const updatedTime = "July 15, 2025"
    return (
        <div className="min-h-screen bg-parchment">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Updated Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-4">
                        About CodeStroke Pro
                    </h1>
                    <p className="text-deep-charcoal/70 text-lg max-w-3xl mx-auto">
                        Empowering healthcare professionals with evidence-based stroke care protocols and resources.
                    </p>
                </div>

                {/* Main Content */}
                <main>
                    {/* Funding Section */}
                    <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
                        <CardHeader className="bg-clinical-slate text-parchment p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                                Funding & Development
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                            <p className="text-gray-600 mb-4">
                                This project was funded by a grant from the Living Well Foundation.
                            </p>
                            <p className="text-gray-600 mb-6">
                                The Living Well Foundation is a public non-profit organization dedicated to enhancing the health, wellness,
                                and quality of life in northeast Louisiana. Founded in 2006, the Living Well Foundation serves the residents
                                of Caldwell, Franklin, Jackson, Lincoln, Morehouse, Ouachita, Richland, and Union Parishes.
                                For more information about the Foundation, visit <a href="https://www.livingwellfoundation.net"
                                    className="text-blue-600 hover:underline" target="_blank">www.livingwellfoundation.net</a>.
                                The Living Well Foundation's commitment to improving healthcare accessibility helps us provide essential
                                stroke care resources to those who need them most.
                            </p>

                            <p className="text-gray-600">
                                This project was created by faculty members at University of Louisiana at Monroe College of Pharmacy
                                and also supports the mission of the ULM College of Pharmacy: Enhancing the health and environment
                                of the communities we serve.
                            </p>
                            <p className="mt-4 text-gray-600 text-center">
                                <span className="font-semibold text-clinical-slate">Mission Statement: </span><span className="italic">"Empowering Rural Healthcare Providers. Enhancing Stroke Care. Saving Lives."</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Research Investigators Section */}
                    <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
                        <CardHeader className="bg-clinical-slate text-parchment p-4 md:p-6">
                            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                                Research Investigators
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Investigator 1 */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-semibold text-clinical-slate mb-2">Emily McGee, PharmD, BCPS, BCEMP, NREMT</h3>
                                    <p className="text-gray-600 mb-1">Assistant Clinical Professor</p>
                                    <p className="text-gray-600 mb-1">University of Louisiana at Monroe</p>
                                    <p className="text-gray-600">Emergency Medicine Clinical Pharmacist</p>
                                    <p className="text-gray-600">Ochsner LSU Health Shreveport</p>
                                </div>

                                {/* Investigator 2 */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-semibold text-clinical-slate mb-2">Angela Moore, PharmD, BSN, RN</h3>
                                    <p className="text-gray-600 mb-1">Clinical Assistant Professor</p>
                                    <p className="text-gray-600">Lab Coordinator</p>
                                </div>

                                {/* Investigator 3 */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-semibold text-clinical-slate mb-2">Ashley Barbo, Pharm.D.</h3>
                                    <p className="text-gray-600 mb-1">Clinical Associate Professor</p>
                                    <p className="text-gray-600">Lab Coordinator</p>
                                </div>


                            </div>
                        </CardContent>
                    </Card>

                    {/* Logos Section */}
                    <section className="mb-12">
                        <h2 className="text-xl font-medium text-clinical-slate mb-6 text-center">Thanks To:</h2>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                            <div className="bg-white p-4 rounded-lg shadow-sm flex justify-center items-center h-32 w-64">
                                <Image
                                    src={ULM_LOGO}
                                    alt="University of Louisiana at Monroe"
                                    className="h-full object-contain"
                                    width={200}
                                    height={60}
                                    priority
                                />
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm flex justify-center items-center h-32 w-64">
                                <Image
                                    src={LIVING_WELL_LOGO}
                                    alt="Living Well Foundation"
                                    className="h-full object-contain"
                                    width={200}
                                    height={60}
                                    priority
                                />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}