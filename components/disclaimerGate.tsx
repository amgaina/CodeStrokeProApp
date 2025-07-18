// components/providers/DisclaimerGate.tsx
'use client';

import React, { useState, useEffect } from 'react';
import LegalDisclaimerModal from './legalDisclaimerModal';

// This is the key for storing the agreement status in localStorage
const DISCLAIMER_AGREEMENT_KEY = 'hasAgreedToLegalDisclaimer';

export default function DisclaimerGate({ children }: { children: React.ReactNode }) {
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // On component mount, check localStorage for previous agreement
    useEffect(() => {
        // localStorage is only available in the browser
        const hasAgreed = localStorage.getItem(DISCLAIMER_AGREEMENT_KEY) === 'true';
        setIsAgreed(hasAgreed);
        setIsLoading(false); // Stop loading once the check is complete
    }, []);

    const handleAgree = () => {
        // When the user agrees, save it to localStorage and update the state
        localStorage.setItem(DISCLAIMER_AGREEMENT_KEY, 'true');
        setIsAgreed(true);
    };

    // While checking localStorage, render nothing to prevent a flash of content
    if (isLoading) {
        return null;
    }

    // If the user has not agreed, show the modal.
    // The rest of the app (`children`) will not be rendered.
    if (!isAgreed) {
        return <LegalDisclaimerModal onAgree={handleAgree} />;
    }

    // If they have agreed, show the application.
    return <>{children}</>;
}