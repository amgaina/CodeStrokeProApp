"use client";

import { useMemo } from "react";
import jsPDF from "jspdf";
// Import the jsPDF AutoTable plugin
import "jspdf-autotable";

interface ScoreRecord {
    [key: string]: number | null;
}

interface SeverityInfo {
    label: string;
    color: string;
}

interface NIHSSQuestionOption {
    value: number | null;
    label: string;
}

interface UseNihssPdfProps {
    scores: ScoreRecord;
    totalScore: number;
    severity: SeverityInfo;
}

/**
 * Custom hook for generating NIHSS assessment PDF
 */
export default function useNihssPdf({
    scores,
    totalScore,
    severity,
}: UseNihssPdfProps) {
    // Define all question options for lookup - memoized to avoid recreating on each render
    const questionOptions = useMemo<Record<string, NIHSSQuestionOption[]>>(
        () => ({
            "1a": [
                { value: 0, label: "Alert; keenly responsive" },
                {
                    value: 1,
                    label: "Not alert; but arousable by minor stimulation",
                },
                {
                    value: 2,
                    label: "Not alert; requires repeated stimulation to attend",
                },
                {
                    value: 3,
                    label: "Unresponsive or responds only with reflex",
                },
            ],
            "1b": [
                { value: 0, label: "Answers both questions correctly" },
                { value: 1, label: "Answers one question correctly" },
                { value: 2, label: "Answers neither question correctly" },
            ],
            "1c": [
                { value: 0, label: "Performs both tasks correctly" },
                { value: 1, label: "Performs one task correctly" },
                { value: 2, label: "Performs neither task correctly" },
            ],
            "2": [
                { value: 0, label: "Normal" },
                { value: 1, label: "Partial gaze palsy" },
                { value: 2, label: "Forced deviation/total gaze paresis" },
            ],
            "3": [
                { value: 0, label: "No visual loss" },
                { value: 1, label: "Partial hemianopia" },
                { value: 2, label: "Complete hemianopia" },
                { value: 3, label: "Bilateral hemianopia/blindness" },
            ],
            "4": [
                { value: 0, label: "Normal symmetrical movements" },
                { value: 1, label: "Minor paralysis" },
                { value: 2, label: "Partial paralysis of lower face" },
                { value: 3, label: "Complete paralysis (one/both sides)" },
            ],
            "5a": [
                { value: 0, label: "No drift; holds full 10 seconds" },
                { value: 1, label: "Drift before full 10 seconds" },
                { value: 2, label: "Some effort against gravity" },
                { value: 3, label: "No effort against gravity" },
                { value: 4, label: "No movement" },
            ],
            "5b": [
                { value: 0, label: "No drift; holds full 10 seconds" },
                { value: 1, label: "Drift before full 10 seconds" },
                { value: 2, label: "Some effort against gravity" },
                { value: 3, label: "No effort against gravity" },
                { value: 4, label: "No movement" },
            ],
            "6a": [
                { value: 0, label: "No drift; holds 5 seconds" },
                { value: 1, label: "Drift before 5 seconds, doesn't hit bed" },
                { value: 2, label: "Falls to bed by 5 seconds" },
                { value: 3, label: "Falls to bed immediately" },
                { value: 4, label: "No movement" },
            ],
            "6b": [
                { value: 0, label: "No drift; holds 5 seconds" },
                { value: 1, label: "Drift before 5 seconds, doesn't hit bed" },
                { value: 2, label: "Falls to bed by 5 seconds" },
                { value: 3, label: "Falls to bed immediately" },
                { value: 4, label: "No movement" },
            ],
            "7": [
                { value: 0, label: "Absent" },
                { value: 1, label: "Present in one limb" },
                { value: 2, label: "Present in two limbs" },
            ],
            "8": [
                { value: 0, label: "Normal; no sensory loss" },
                { value: 1, label: "Mild-to-moderate sensory loss" },
                { value: 2, label: "Severe or total sensory loss" },
            ],
            "9": [
                { value: 0, label: "No aphasia; normal" },
                { value: 1, label: "Mild-to-moderate aphasia" },
                { value: 2, label: "Severe aphasia" },
                { value: 3, label: "Mute, global aphasia" },
            ],
            "10": [
                { value: 0, label: "Normal" },
                { value: 1, label: "Mild-to-moderate dysarthria" },
                { value: 2, label: "Severe dysarthria" },
            ],
            "11": [
                { value: 0, label: "No abnormality" },
                {
                    value: 1,
                    label: "Visual/tactile/auditory/spatial inattention",
                },
                { value: 2, label: "Profound hemi-inattention or extinction" },
            ],
        }),
        []
    );

    // Question titles - memoized
    const questionTitles = useMemo<Record<string, string>>(
        () => ({
            "1a": "Level of Consciousness",
            "1b": "LOC Questions",
            "1c": "LOC Commands",
            "2": "Best Gaze",
            "3": "Visual",
            "4": "Facial Palsy",
            "5a": "Left Motor Arm",
            "5b": "Right Motor Arm",
            "6a": "Left Motor Leg",
            "6b": "Right Motor Leg",
            "7": "Limb Ataxia",
            "8": "Sensory",
            "9": "Best Language",
            "10": "Dysarthria",
            "11": "Extinction and Inattention",
        }),
        []
    );

    /**
     * Generate a PDF report of NIHSS assessment
     */
    const generatePDF = () => {
        try {
            // Initialize jsPDF
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // Brand colors
            const brandColor = "#3A506B"; // clinical-slate

            // Add CodeStrokePro logo and branding
            doc.setTextColor(brandColor);
            doc.setFontSize(22);
            doc.text("CodeStrokePro", 20, 20);

            doc.setFontSize(16);
            doc.text("NIH Stroke Scale Assessment", 20, 30);

            // Add generation date
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            const dateStr = new Date().toLocaleString();
            doc.text(`Generated: ${dateStr}`, 20, 40);

            // Add score summary
            doc.setFontSize(14);
            doc.setTextColor(brandColor);
            doc.text("NIHSS Score Summary", 20, 50);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Total Score: ${totalScore}`, 20, 58);

            // Add severity with appropriate color
            let severityR = 100,
                severityG = 100,
                severityB = 100;
            if (severity.color === "vital-green") {
                severityR = 42;
                severityG = 157;
                severityB = 143; // #2A9D8F
            } else if (severity.color === "urgent-amber") {
                severityR = 233;
                severityG = 196;
                severityB = 106; // #E9C46A
            } else if (severity.color === "critical-crimson") {
                severityR = 214;
                severityG = 40;
                severityB = 40; // #D62828
            }

            doc.setTextColor(severityR, severityG, severityB);
            doc.text(`Severity: ${severity.label}`, 70, 58);

            // Reset color
            doc.setTextColor(0, 0, 0);

            // Add completion status
            const isComplete = Object.values(scores).every((s) => s !== null);
            doc.setTextColor(
                isComplete ? 42 : 100,
                isComplete ? 157 : 100,
                isComplete ? 143 : 100
            );
            doc.text(
                `Status: ${isComplete ? "Complete" : "Incomplete"}`,
                130,
                58
            );

            // Add horizontal line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 62, pageWidth - 20, 62);

            // Reset text color for table
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);

            // Prepare table data for assessment items
            const tableData: Array<[string, string, string]> = [];

            // Build data rows
            Object.keys(scores).forEach((key) => {
                const score = scores[key];
                let finding = "Not assessed";

                if (score !== null && questionOptions[key]) {
                    const options = questionOptions[key];
                    const option = options.find((o) => o.value === score);
                    finding = option ? option.label : "Unknown";
                }

                const itemTitle = questionTitles[key] || `Item ${key}`;

                tableData.push([
                    itemTitle,
                    score !== null ? score.toString() : "UN",
                    finding,
                ]);
            });

            // Manually create a simple table
            let yPos = 70;
            const rowHeight = 10;
            const colWidths = [60, 20, 100];

            // Draw table header
            doc.setFillColor(brandColor);
            doc.setTextColor(255, 255, 255);
            doc.rect(
                20,
                yPos,
                colWidths[0] + colWidths[1] + colWidths[2],
                rowHeight,
                "F"
            );
            doc.text("Item", 22, yPos + 7);
            doc.text("Score", 22 + colWidths[0], yPos + 7);
            doc.text("Finding", 22 + colWidths[0] + colWidths[1], yPos + 7);

            yPos += rowHeight;

            // Draw table rows
            doc.setTextColor(0, 0, 0);
            let isGray = false;
            tableData.forEach((row) => {
                if (isGray) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(
                        20,
                        yPos,
                        colWidths[0] + colWidths[1] + colWidths[2],
                        rowHeight,
                        "F"
                    );
                }

                doc.text(row[0], 22, yPos + 7);
                doc.text(row[1], 22 + colWidths[0], yPos + 7);
                doc.text(
                    row[2].substring(0, 35),
                    22 + colWidths[0] + colWidths[1],
                    yPos + 7
                );

                yPos += rowHeight;
                isGray = !isGray;
            });

            // Add footer
            const finalY = yPos + 10;
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(
                "This assessment was generated using CodeStrokePro. Visit codestrokepro.org for more information.",
                20,
                finalY
            );
            doc.text("Page 1 of 1", pageWidth / 2, finalY + 10, {
                align: "center",
            });

            // Add metadata to the PDF
            doc.setProperties({
                title: "NIH Stroke Scale (NIHSS) Assessment",
                subject: "NIHSS assessment results and details",
                author: "CodeStrokePro",
                keywords:
                    "NIHSS, stroke, assessment, NIH Stroke Scale, screening",
                creator: "CodeStrokePro",
            });

            // Save PDF with date in filename
            const now = new Date();
            const datePart = `${now.getFullYear()}-${String(
                now.getMonth() + 1
            ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
            doc.save(`nihss-assessment-${datePart}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("There was an error generating the PDF. Please try again.");
        }
    };

    return { generatePDF };
}
