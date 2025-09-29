/**
 * Author: Abhishek Amgain and Dinesh Chhantyal
 * Version: 1.0.0
 * File Description:
 * This file defines the DisclaimerBanner component. It displays a persistent,
 * dismissible warning banner at the top of the application to inform users
 * about the site's development status.
 */

"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

// The key used to store the dismissal state in localStorage.
const DISMISS_KEY = "csp-disclaimer-dismissed-v1";

export default function DisclaimerBanner() {
    const [isVisible, setIsVisible] = useState(false);

    // On component mount, check if the banner has already been dismissed.
    // Using localStorage makes the dismissal persistent across browser sessions.
    useEffect(() => {
        const hasDismissed = localStorage.getItem(DISMISS_KEY) === "true";
        if (!hasDismissed) {
            setIsVisible(true);
        }
    }, []);

    /**
     * Handles the user's click on the dismiss button.
     * It hides the banner and sets a flag in localStorage.
     */
    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, "true");
        setIsVisible(false);
    };

    // If the banner should not be visible, render nothing.
    if (!isVisible) {
        return null;
    }

    // Otherwise, render the banner.
    return (
        <div className="relative z-40 bg-yellow-100 p-4 text-yellow-900 shadow-md">
            <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 flex-shrink-0 text-yellow-500" />
                    <div className="flex-grow text-sm">
                        <p className="font-bold">
                            Important: Development Preview
                        </p>
                        <p>
                            This application is for demonstration and testing
                            purposes only. Information may be inaccurate.{" "}
                            <strong>
                                Do not use for actual clinical decision-making.
                            </strong>
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    aria-label="Dismiss warning"
                    className="flex-shrink-0 rounded-md p-1 hover:bg-yellow-200"
                    name="dismiss-warning"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
