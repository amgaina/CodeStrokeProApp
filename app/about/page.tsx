import Image from "next/image";
import ULM_LOGO from "@/assets/ulm_logo.png";
import LIVING_WELL_LOGO from "@/assets/LWF_logo.png"

export default function AboutPage() {
    const updatedTime = "July 15, 2025"
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-clinical-slate text-center">
                        About CodeStroke Pro
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Funding Section */}
                <section className="mb-12">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-clinical-slate mb-4">Funding & Development</h2>
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
                    </div>
                </section>

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
    );
}