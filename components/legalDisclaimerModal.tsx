// components/modals/LegalDisclaimerModal.tsx
import React from "react";

// Define the props for the component
interface LegalDisclaimerModalProps {
    onAgree: () => void;
    onDisagree: () => void; // ADDED: Prop for the disagree action
}

export default function LegalDisclaimerModal({
    onAgree,
    onDisagree, // ADDED: Destructure the new prop
}: LegalDisclaimerModalProps) {
    // MODIFIED: The function now calls the onDisagree prop instead of redirecting.
    const handleDisagree = () => {
        onDisagree();
    };

    return (
        // Full-screen overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            {/* Modal Dialog */}
            <div className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-deep-charcoal">
                    Legal Disclaimer
                </h2>

                {/* Scrolling Content */}
                <div className="flex-1 overflow-y-auto pr-2 text-deep-charcoal/80">
                    <p className="mb-3">
                        1. This application is provided as a clinical support
                        and educational tool only. It is designed to assist
                        qualified healthcare professionals in managing
                        time-sensitive decisions in acute stroke care but is not
                        a substitute for independent clinical judgment,
                        institutional protocols, or the standard of care.
                    </p>
                    <p className="mb-3">
                        2. This information is current as of 08/07/2025. While
                        reasonable efforts are made to maintain the accuracy and
                        relevance of the information presented, it is the
                        responsibility of the prescriber and care team to verify
                        all data and ensure appropriate treatment is provided.
                    </p>
                    <p className="mb-2">
                        § By using this application, you acknowledge that:
                    </p>
                    <ul className="mb-3 list-inside list-disc space-y-2 pl-4">
                        <li>
                            The app does not make treatment decisions and is not
                            a source of medical advice.
                        </li>
                        <li>
                            The app provides guidance only, based on user-input
                            data and current evidence or clinical standards as
                            of the noted date.
                        </li>
                        <li>
                            Ultimate responsibility for patient care remains
                            solely with the treating provider(s).
                        </li>
                        <li>
                            With the appropriate disclaimers in place, the
                            liability of the developers and affiliated
                            institutions is considered to be very low. The
                            developers and institutions assume no liability for
                            any direct or indirect damages, injuries, or
                            outcomes resulting from use or reliance on this
                            tool.
                        </li>
                        <li>
                            By continuing, you acknowledge and accept these
                            terms.
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4 border-t pt-4">
                    <button
                        onClick={handleDisagree}
                        className="rounded-md px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                        name="disagree"
                    >
                        Disagree
                    </button>
                    <button
                        onClick={onAgree}
                        className="rounded-md bg-clinical-slate px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clinical-slate/90"
                        name="agree"
                    >
                        Agree and Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
