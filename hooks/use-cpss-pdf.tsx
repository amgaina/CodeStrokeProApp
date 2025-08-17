"use client";

import { useMemo } from "react";
import { jsPDF } from "jspdf";
// Import the jsPDF AutoTable plugin
import autoTable from "jspdf-autotable";

interface UseCpssPdfProps {
    answers: {
        facialDroop: boolean | null;
        armDrift: boolean | null;
        speech: boolean | null;
    };
    hasPositiveSign: boolean;
    isComplete: boolean;
}

/**
 * Custom hook for generating CPSS assessment PDF
 */
export default function useCpssPdf({
    answers,
    hasPositiveSign,
    isComplete,
}: UseCpssPdfProps) {
    // Memoized criteria descriptions to avoid recreating on each render
    const criteriaDescriptions = useMemo(() => ({
        facialDroop: "Ask the patient to smile or show their teeth.",
        armDrift: "Ask patient to close eyes and hold both arms out with palms up for 10 seconds.",
        speech: "Ask patient to repeat a simple phrase like 'The sky is blue in Cincinnati.'",
    }), []);

    /**
     * Generate a PDF report of CPSS assessment
     */
    const generatePDF = () => {
        try {
            // Initialize jsPDF
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // Brand colors
            const brandColor = "#3A506B"; // clinical-slate
            const positiveColor = "#f59e0b"; // amber-500
            const negativeColor = "#22c55e"; // green-500

            // Add CodeStrokePro logo and branding
            doc.setTextColor(brandColor);
            doc.setFontSize(22);
            doc.text("CodeStrokePro", 20, 20);

            doc.setFontSize(16);
            doc.text("Cincinnati Prehospital Stroke Scale (CPSS)", 20, 30);

            // Add generation date
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            const dateStr = new Date().toLocaleString();
            doc.text(`Generated: ${dateStr}`, 20, 40);

            // Add assessment summary
            doc.setFontSize(14);
            doc.setTextColor(brandColor);
            doc.text("Assessment Summary", 20, 50);

            // Result status with appropriate color
            doc.setFontSize(12);
            if (isComplete) {
                if (hasPositiveSign) {
                    doc.setTextColor(positiveColor);
                    doc.text("Result: Positive Screen — Stroke Likely", 20, 58);
                    doc.setFontSize(10);
                    doc.setTextColor(100, 100, 100);
                    doc.text("(~72% probability if any 1 of 3 signs present)", 20, 65);
                } else {
                    doc.setTextColor(negativeColor);
                    doc.text("Result: Negative Screen", 20, 58);
                }
            } else {
                doc.setTextColor(100, 100, 100);
                doc.text("Result: Assessment Incomplete", 20, 58);
            }

            // Add horizontal line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 72, pageWidth - 20, 72);

            // Reset text color for details section
            doc.setFontSize(14);
            doc.setTextColor(brandColor);
            doc.text("Assessment Details", 20, 80);
            
            // Create a table for the assessment criteria
            const tableData = [
                ["Assessment", "Result", "Description"],
                [
                    "Facial Droop", 
                    answers.facialDroop === null ? "Not Assessed" : 
                        answers.facialDroop ? "Abnormal" : "Normal",
                    criteriaDescriptions.facialDroop
                ],
                [
                    "Arm Drift", 
                    answers.armDrift === null ? "Not Assessed" : 
                        answers.armDrift ? "Abnormal" : "Normal",
                    criteriaDescriptions.armDrift
                ],
                [
                    "Speech", 
                    answers.speech === null ? "Not Assessed" : 
                        answers.speech ? "Abnormal" : "Normal",
                    criteriaDescriptions.speech
                ]
            ];
            
            // Use autoTable directly, not as doc.autoTable
            autoTable(doc, {
                startY: 85,
                head: [tableData[0]],
                body: tableData.slice(1),
                theme: 'striped',
                headStyles: {
                    fillColor: [58, 80, 107], // brandColor
                    textColor: [255, 255, 255]
                },
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 'auto' }
                },
                bodyStyles: {
                    fontSize: 11
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                }
            });

            // Add final assessment below the table
            const tablePosition = (doc as any).previousAutoTable || {};
            let finalY = (tablePosition.finalY || 140) + 10;
            
            doc.setTextColor(brandColor);
            doc.setFontSize(14);
            doc.text("Final Assessment", 20, finalY);
            
            doc.setFontSize(12);
            if (isComplete) {
                if (hasPositiveSign) {
                    doc.setTextColor(200, 100, 0); // amber/orange
                    doc.text("POSITIVE SCREEN — STROKE LIKELY", 20, finalY + 7);
                    
                    doc.setTextColor(100, 100, 100);
                    doc.setFontSize(11);
                    doc.text("Approximately 72% probability with any 1 of 3 signs present", 20, finalY + 14);
                    
                    // Add findings
                    finalY += 20;
                    doc.setTextColor(0, 0, 0);
                    doc.text("Positive findings:", 20, finalY);
                    
                    // Start position for list items
                    let listY = finalY + 7;
                    
                    if (answers.facialDroop === true) {
                        doc.text("• Facial droop: Abnormal", 30, listY);
                        listY += 7;
                    }
                    if (answers.armDrift === true) {
                        doc.text("• Arm drift: Abnormal", 30, listY);
                        listY += 7;
                    }
                    if (answers.speech === true) {
                        doc.text("• Speech: Abnormal", 30, listY);
                        listY += 7;
                    }
                    
                    // Update finalY to reflect the last item position
                    finalY = listY;
                } else {
                    doc.setTextColor(negativeColor);
                    doc.text("NEGATIVE SCREEN", 20, finalY + 7);
                    doc.setTextColor(100, 100, 100);
                    doc.setFontSize(11);
                    doc.text("No abnormal findings detected.", 20, finalY + 14);
                    finalY += 20;
                }
            } else {
                doc.setTextColor(100, 100, 100);
                doc.text("Assessment incomplete. Please complete all three questions.", 20, finalY + 7);
                finalY += 14;
            }

            finalY += 10;
            
            // Add footer
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(
                "This assessment was generated using CodeStrokePro. Visit codestrokepro.org for more information.",
                20,
                finalY
            );
            
            doc.text("Page 1 of 1", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, {
                align: "center",
            });

            // Save PDF with date in filename
            const now = new Date();
            const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
            doc.save(`cpss-assessment-${datePart}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("There was an error generating the PDF. Please try again.");
        }
    };

    return { generatePDF };
}
