// components/providers/disagreementWarningModal.tsx
"use client";

import React from "react";

// Basic styling for the modal
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
    minWidth: "300px",
    textAlign: "center",
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

const buttonStyles: React.CSSProperties = {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#3A506B",
    color: "white",
    border: "none",
    borderRadius: "5px",
};

export default function DisagreementWarningModal({
    onClose,
}: {
    onClose: () => void;
}) {
    return (
        <>
            <div style={overlayStyles} />
            <div style={modalStyles}>
                <h3>Access Requirement</h3>
                <p>
                    You must agree to the terms before you can view this page
                    because it contains sensitive clinical information.
                </p>
                <button
                    style={buttonStyles}
                    onClick={onClose}
                    name="close-modal"
                >
                    OK
                </button>
            </div>
        </>
    );
}
