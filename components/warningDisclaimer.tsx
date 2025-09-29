// components/providers/legalDisclaimerModal.tsx
"use client";

import React from "react";

// Basic styling for the modal (can be shared or customized)
const modalStyles: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    zIndex: 1001,
    maxWidth: "600px",
};

const overlayStyles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 1000,
};

const buttonContainerStyles: React.CSSProperties = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
};

const buttonStyles: React.CSSProperties = {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
};

// Define props to accept onAgree and onDisagree handlers
interface LegalDisclaimerModalProps {
    onAgree: () => void;
    onDisagree: () => void;
}

export default function LegalDisclaimerModal({
    onAgree,
    onDisagree,
}: LegalDisclaimerModalProps) {
    return (
        <>
            <div style={overlayStyles} />
            <div style={modalStyles}>
                <h2>Legal Disclaimer</h2>
                <p>
                    The information contained on this website is for
                    informational purposes only and is not intended to be a
                    substitute for professional medical advice, diagnosis, or
                    treatment. Always seek the advice of your physician or other
                    qualified health provider with any questions you may have
                    regarding a medical condition.
                </p>
                {/* Button container */}
                <div style={buttonContainerStyles}>
                    {/* Disagree Button */}
                    <button
                        style={{
                            ...buttonStyles,
                            backgroundColor: "#dc3545",
                            color: "white",
                        }}
                        onClick={onDisagree}
                        name="disagree"
                    >
                        Disagree
                    </button>
                    {/* Agree Button */}
                    <button
                        style={{
                            ...buttonStyles,
                            backgroundColor: "#28a745",
                            color: "white",
                        }}
                        onClick={onAgree}
                        name="agree"
                    >
                        Agree
                    </button>
                </div>
            </div>
        </>
    );
}
