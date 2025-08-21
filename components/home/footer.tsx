import { Mail, FileText } from "lucide-react";

export default function AppFooter() {
    const updatedTime = "March 26, 2025";
    return (
        <footer className="bg-slate-800 text-slate-100 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            Contact Information
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <Mail className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-gray-300">
                                        rsep0963@gmail.com
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Disclaimers & Guidelines */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <span className="bg-blue-600 p-2 rounded-full mr-3">
                                <FileText className="h-4 w-4" />
                            </span>
                            Disclaimers & Guidelines
                        </h3>
                        <div className="prose prose-sm prose-invert text-gray-300">
                            <ul className="list-none space-y-3 pl-0">
                                <li className="flex">
                                    <span className="text-blue-400 mr-2">
                                        ▪
                                    </span>
                                    <p>
                                        This application is provided as a
                                        clinical support and educational tool
                                        only. It is designed to assist qualified
                                        healthcare professionals in managing
                                        time-sensitive decisions in acute stroke
                                        care but is not a substitute for
                                        independent clinical judgment,
                                        institutional protocols, or the standard
                                        of care.
                                    </p>
                                </li>
                                <li className="flex">
                                    <span className="text-blue-400 mr-2">
                                        ▪
                                    </span>
                                    <p>
                                        This information is current as of{" "}
                                        {updatedTime}. While reasonable efforts
                                        are made to maintain the accuracy and
                                        relevance of the information presented,
                                        it is the responsibility of the
                                        prescriber and care team to verify all
                                        data and ensure appropriate treatment is
                                        provided.
                                    </p>
                                </li>
                                <li className="flex">
                                    <span className="text-blue-400 mr-2">
                                        ▪
                                    </span>
                                    <div>
                                        <p className="mb-2">
                                            By using this application, you
                                            acknowledge that:
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>
                                                The app does not make treatment
                                                decisions and is not a source of
                                                medical advice.
                                            </li>
                                            <li>
                                                The app provides guidance only,
                                                based on user-input data and
                                                current evidence or clinical
                                                standards as of the noted date.
                                            </li>
                                            <li>
                                                Ultimate responsibility for
                                                patient care remains solely with
                                                the treating provider(s).
                                            </li>
                                            <li>
                                                With the appropriate disclaimers
                                                in place, the liability of the
                                                developers and affiliated
                                                institutions is considered to be
                                                very low. The developers and
                                                institutions assume no liability
                                                for any direct or indirect
                                                damages, injuries, or outcomes
                                                resulting from use or reliance
                                                on this tool.
                                            </li>
                                            <li>
                                                By continuing, you acknowledge
                                                and accept these terms.
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
                    <p>
                        © {new Date().getFullYear()} StrokeStroke Pro. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
