"use client";

import { useMemo } from "react";
import { jsPDF } from "jspdf";
// Import the jsPDF AutoTable plugin
import autoTable from "jspdf-autotable";

interface UseVanPdfProps {
    weaknessPresent: boolean | null;
    checkItems: {
        vision: boolean;
        aphasia: boolean;
        neglect: boolean;
    };
    isVANPositive: boolean;
    isVANNegative: boolean;
    isAssessmentComplete: boolean;
}

/**
 * Custom hook for generating VAN assessment PDF
 */
export default function useVanPdf({
    weaknessPresent,
    checkItems,
    isVANPositive,
    isVANNegative,
    isAssessmentComplete,
}: UseVanPdfProps) {
    // Memoized criteria descriptions to avoid recreating on each render
    const criteriaDescriptions = useMemo(() => ({
        vision: "Field cut, double vision, or blindness",
        aphasia: "Trouble naming objects, repeating sentences, or following commands (not just slurred speech)",
        neglect: "Ignoring one side, eyes/head turned to one side, or not feeling one side",
    }), []);

    /**
     * Generate a PDF report of VAN assessment
     */
    const generatePDF = () => {
        try {
            // Initialize jsPDF
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // Brand colors
            const brandColor = "#3A506B"; // clinical-slate
            const positiveColor = "#ef4444"; // red-500
            const negativeColor = "#22c55e"; // green-500

            // Add CodeStrokePro logo and branding
            doc.setTextColor(brandColor);
            doc.setFontSize(22);
            doc.text("CodeStrokePro", 20, 20);

            doc.setFontSize(16);
            doc.text("VAN Assessment for LVO", 20, 30);

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
            if (isAssessmentComplete) {
                if (isVANPositive) {
                    doc.setTextColor(positiveColor);
                    doc.text("Result: VAN Positive - High Likelihood of LVO", 20, 58);
                } else {
                    doc.setTextColor(negativeColor);
                    doc.text("Result: VAN Negative", 20, 58);
                }
            } else {
                doc.setTextColor(100, 100, 100);
                doc.text("Result: Assessment Incomplete", 20, 58);
            }

            // Add horizontal line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 62, pageWidth - 20, 62);

            // Reset text color for details section
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            
            // Add detailed assessment information
            doc.setFontSize(14);
            doc.setTextColor(brandColor);
            doc.text("Assessment Details", 20, 70);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            
            // Step 1: Weakness assessment
            doc.text("Step 1: Motor Weakness", 20, 80);
            
            if (weaknessPresent === null) {
                doc.setTextColor(100, 100, 100);
                doc.text("Status: Not assessed", 30, 87);
            } else {
                doc.setTextColor(weaknessPresent ? 200 : 34, weaknessPresent ? 100 : 197, weaknessPresent ? 0 : 94);
                doc.text(`Status: ${weaknessPresent ? "Present" : "Not Present"}`, 30, 87);
                
                // If no weakness present, add explanation
                if (!weaknessPresent) {
                    doc.setTextColor(100, 100, 100);
                    doc.text("Note: Without weakness, VAN is negative.", 30, 94);
                }
            }
            
            // Step 2: VAN criteria (only if weakness present)
            if (weaknessPresent === true) {
                doc.setTextColor(0, 0, 0);
                doc.text("Step 2: VAN Criteria", 20, 105);
                
                // Create a table for the VAN criteria
                const tableData = [
                    ["Criteria", "Status", "Description"],
                    ["Vision", checkItems.vision ? "Present" : "Absent", criteriaDescriptions.vision],
                    ["Aphasia", checkItems.aphasia ? "Present" : "Absent", criteriaDescriptions.aphasia],
                    ["Neglect", checkItems.neglect ? "Present" : "Absent", criteriaDescriptions.neglect]
                ];
                
                // Use autoTable directly
                autoTable(doc, {
                    startY: 110,
                    head: [tableData[0]],
                    body: tableData.slice(1),
                    theme: 'striped',
                    headStyles: {
                        fillColor: [58, 80, 107], // brandColor
                        textColor: [255, 255, 255]
                    },
                    columnStyles: {
                        0: { cellWidth: 30 },
                        1: { cellWidth: 30 },
                        2: { cellWidth: 'auto' }
                    }
                });

                // Add final assessment below the table
                const tablePosition = (doc as any).previousAutoTable || {};
                let finalY = (tablePosition.finalY || 165) + 10;
                
                doc.setTextColor(brandColor);
                doc.setFontSize(14);
                doc.text("Final Assessment", 20, finalY);
                
                if (isVANPositive) {
                    doc.setTextColor(positiveColor);
                    doc.setFontSize(12);
                    doc.text("VAN POSITIVE: High likelihood of Large Vessel Occlusion (LVO)", 20, finalY + 7);
                    
                    // Add recommendation
                    doc.setTextColor(100, 100, 100);
                    doc.setFontSize(10);
                    doc.text("Consider immediate vascular imaging and specialized intervention.", 20, finalY + 14);
                } else {
                    doc.setTextColor(negativeColor);
                    doc.setFontSize(12);
                    doc.text("VAN NEGATIVE: Weakness present but no VAN criteria detected", 20, finalY + 7);
                }

                finalY += 20;
                
                // Add footer
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(
                    "This assessment was generated using CodeStrokePro. Visit codestrokepro.org for more information.",
                    20,
                    finalY
                );
            } else {
                // Add footer when no weakness present
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(
                    "This assessment was generated using CodeStrokePro. Visit codestrokepro.org for more information.",
                    20,
                    110
                );
            }
            
            doc.text("Page 1 of 1", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, {
                align: "center",
            });

            // Add metadata to the PDF
            doc.setProperties({
                title: "VAN Assessment for LVO",
                subject: "VAN assessment results and details",
                author: "CodeStrokePro",
                keywords: "VAN, stroke, assessment, LVO, screening",
                creator: "CodeStrokePro",
            });

            // Save PDF with date in filename
            const now = new Date();
            const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
            doc.save(`van-assessment-${datePart}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("There was an error generating the PDF. Please try again.");
        }
    };

    return { generatePDF };
}
