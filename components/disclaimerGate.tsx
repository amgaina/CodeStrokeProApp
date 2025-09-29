// components/providers/DisclaimerGate.tsx
'use client';

import React, { useState, useEffect } from 'react';
import LegalDisclaimerModal from './legalDisclaimerModal';
import DisagreementWarningModal from './disagreementWarningModal';

// This is the key for storing the agreement status in localStorage
const DISCLAIMER_AGREEMENT_KEY = 'hasAgreedToLegalDisclaimer';

export default function DisclaimerGate({ children }: { children: React.ReactNode }) {
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // New state to control the visibility of the disagreement warning modal
    const [showDisagreeWarning, setShowDisagreeWarning] = useState(false);

    useEffect(() => {
        const hasAgreed = localStorage.getItem(DISCLAIMER_AGREEMENT_KEY) === 'true';
        setIsAgreed(hasAgreed);
        setIsLoading(false);
    }, []);

    const handleAgree = () => {
        localStorage.setItem(DISCLAIMER_AGREEMENT_KEY, 'true');
        setIsAgreed(true);
    };

    // New handler for when the user clicks "Disagree"
    const handleDisagree = () => {
        setShowDisagreeWarning(true);
    };

    // New handler to close the warning modal and show the main disclaimer again
    const handleCloseWarning = () => {
        setShowDisagreeWarning(false);
    };

    if (isLoading) {
        return null;
    }

    // If the user hasn't agreed, we decide which modal to show
    if (!isAgreed) {
        // If they've clicked "Disagree", show the warning modal
        if (showDisagreeWarning) {
            return <DisagreementWarningModal onClose={handleCloseWarning} />;
        }

        // Otherwise, show the primary legal disclaimer modal
        return <LegalDisclaimerModal onAgree={handleAgree} onDisagree={handleDisagree} />;
    }

    // If they have agreed, show the application
    return <>{children}</>;
}