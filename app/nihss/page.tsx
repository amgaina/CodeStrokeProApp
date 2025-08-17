"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Info } from "lucide-react";
import NIHSSTimer from "@/components/nihss/NIHSSTimer";
import NIHSSQuestion from "@/components/nihss/NIHSSQuestion";
import NIHSSScore from "@/components/nihss/NIHSSScore";

interface ScoreRecord {
    [key: string]: number | null;
}

export default function NIHSSCalculator() {
    const [scores, setScores] = useState<ScoreRecord>({
        "1a": null, // Level of Consciousness
        "1b": null, // LOC Questions
        "1c": null, // LOC Commands
        "2": null, // Best Gaze
        "3": null, // Visual Fields
        "4": null, // Facial Palsy
        "5a": null, // Left Motor Arm
        "5b": null, // Right Motor Arm
        "6a": null, // Left Motor Leg
        "6b": null, // Right Motor Leg
        "7": null, // Limb Ataxia
        "8": null, // Sensory
        "9": null, // Best Language
        "10": null, // Dysarthria
        "11": null, // Extinction and Inattention
    });

    const mainRef = useRef<HTMLDivElement>(null);

    // Calculate total score
    const totalScore: number = Object.values(scores).reduce(
        (acc: number, val: number | null) =>
            acc + (val !== null ? Number(val) : 0),
        0
    );

    // Determine severity based on total score
    const getSeverity = () => {
        if (totalScore >= 0 && totalScore <= 4)
            return { label: "Minor stroke", color: "vital-green" };
        if (totalScore >= 5 && totalScore <= 15)
            return { label: "Moderate stroke", color: "urgent-amber" };
        if (totalScore >= 16 && totalScore <= 20)
            return { label: "Moderate–severe stroke", color: "urgent-amber" };
        if (totalScore >= 21 && totalScore <= 42)
            return { label: "Severe stroke", color: "critical-crimson" };
        return { label: "Incomplete assessment", color: "harbor-gray" };
    };
    const severity = getSeverity();

    // Handle score changes
    const handleScoreChange = (questionId: string, value: number | null) => {
        setScores((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    // Reset all scores
    const resetScores = () => {
        const resetValues: ScoreRecord = {};
        Object.keys(scores).forEach((key) => {
            resetValues[key] = null;
        });
        setScores(resetValues);
    };

    // Scroll to top when page loads
    useEffect(() => {
        if (mainRef.current) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, []);

    return (
        <div ref={mainRef} className="min-h-screen bg-parchment">
            {/* Sticky score panel - always visible */}
            <div className="sticky top-[65px] z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto max-w-5xl px-3">
                    <div className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-base text-gray-700">
                                Score:
                            </span>
                            <span className="text-xl font-bold text-deep-charcoal">
                                {totalScore}
                            </span>
                            <div
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    severity.color === "vital-green"
                                        ? "bg-green-100 text-green-700 border border-green-200"
                                        : severity.color === "urgent-amber"
                                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                                        : severity.color === "critical-crimson"
                                        ? "bg-red-100 text-red-700 border border-red-200"
                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                }`}
                            >
                                {severity.label}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Progress indicator */}
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-xs text-gray-600">
                                    {
                                        Object.values(scores).filter(
                                            (s) => s !== null
                                        ).length
                                    }{" "}
                                    of {Object.keys(scores).length} completed
                                </span>
                                <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-300 ease-in-out"
                                        style={{
                                            width: `${
                                                (Object.values(scores).filter(
                                                    (s) => s !== null
                                                ).length /
                                                    Object.keys(scores)
                                                        .length) *
                                                100
                                            }%`,
                                            backgroundColor:
                                                severity.color === "vital-green"
                                                    ? "#22c55e" // green-500
                                                    : severity.color ===
                                                      "urgent-amber"
                                                    ? "#f59e0b" // amber-500
                                                    : severity.color ===
                                                      "critical-crimson"
                                                    ? "#ef4444" // red-500
                                                    : "#64748b", // slate-500
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Reset button */}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={resetScores}
                                className="h-7 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-5xl px-3 py-4 md:py-6">
                {/* Header with instructions */}
                <div className="mb-4 text-center">
                    <h1 className="text-2xl md:text-3xl font-semibold text-deep-charcoal">
                        NIH Stroke Scale Calculator
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Assess stroke severity by answering all questions. Total
                        score ranges from 0–42.
                    </p>
                </div>

                {/* Score summary card */}
                <NIHSSScore
                    totalScore={totalScore}
                    severity={severity}
                    isComplete={Object.values(scores).every((s) => s !== null)}
                    progress={
                        (Object.values(scores).filter((s) => s !== null)
                            .length /
                            Object.keys(scores).length) *
                        100
                    }
                    completedQuestions={
                        Object.values(scores).filter((s) => s !== null).length
                    }
                    totalQuestions={Object.keys(scores).length}
                    showReset={true}
                    onReset={resetScores}
                />

                <Card className="mb-6 shadow-sm border border-gray-200 bg-white">
                    <CardHeader className="bg-clinical-slate text-parchment p-3 md:p-4">
                        <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-medium">
                            <Shield className="w-5 h-5" />
                            NIH Stroke Scale Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 space-y-5">
                        <div className="flex items-center p-2.5 bg-blue-50/50 rounded-lg border border-blue-100/70">
                            <Info className="mr-2 h-4 w-4 text-blue-600" />
                            <p className="text-sm text-gray-600">
                                Complete all sections. Record performance in
                                each category after assessment. Scores should
                                reflect what the patient does, not what you
                                think they can do.
                            </p>
                        </div>

                        {/* Section 1: Level of Consciousness */}
                        <div className="border-b pb-3">
                            <h3 className="font-medium text-base mb-2 text-gray-700 border-l-4 border-clinical-slate pl-2">
                                Level of Consciousness
                            </h3>

                            {/* 1a LOC */}
                            <NIHSSQuestion
                                id="1a"
                                title="1a. Level of Consciousness"
                                instructions="The investigator must choose a response if a full evaluation is prevented by obstacles. A 3 is scored only if the patient makes no movement in response to noxious stimulation."
                                options={[
                                    {
                                        value: 0,
                                        label: "0 - Alert; keenly responsive",
                                    },
                                    {
                                        value: 1,
                                        label: "1 - Not alert; but arousable by minor stimulation to obey, answer, or respond",
                                    },
                                    {
                                        value: 2,
                                        label: "2 - Not alert; requires repeated stimulation to attend",
                                    },
                                    {
                                        value: 3,
                                        label: "3 - Responds only with reflex motor or autonomic effects or totally unresponsive",
                                    },
                                ]}
                                value={scores["1a"]}
                                onChange={(value) =>
                                    handleScoreChange("1a", value)
                                }
                            />

                            {/* 1b LOC Questions */}
                            <NIHSSQuestion
                                id="1b"
                                title="1b. LOC Questions"
                                instructions="Ask the patient the month and their age. The answer must be correct - there is no partial credit for being close."
                                options={[
                                    {
                                        value: 0,
                                        label: "0 - Answers both questions correctly",
                                    },
                                    {
                                        value: 1,
                                        label: "1 - Answers one question correctly",
                                    },
                                    {
                                        value: 2,
                                        label: "2 - Answers neither question correctly",
                                    },
                                ]}
                                value={scores["1b"]}
                                onChange={(value) =>
                                    handleScoreChange("1b", value)
                                }
                            />

                            {/* 1c LOC Commands */}
                            <NIHSSQuestion
                                id="1c"
                                title="1c. LOC Commands"
                                instructions="Ask the patient to open and close the eyes and then to grip and release the non-paretic hand."
                                options={[
                                    {
                                        value: 0,
                                        label: "0 - Performs both tasks correctly",
                                    },
                                    {
                                        value: 1,
                                        label: "1 - Performs one task correctly",
                                    },
                                    {
                                        value: 2,
                                        label: "2 - Performs neither task correctly",
                                    },
                                ]}
                                value={scores["1c"]}
                                onChange={(value) =>
                                    handleScoreChange("1c", value)
                                }
                            />
                        </div>

                        {/* Section 2: Best Gaze */}
                        <NIHSSQuestion
                            id="2"
                            title="2. Best Gaze"
                            instructions="Only horizontal eye movements will be tested. Voluntary or reflexive eye movements will be scored."
                            options={[
                                { value: 0, label: "0 - Normal" },
                                { value: 1, label: "1 - Partial gaze palsy" },
                                {
                                    value: 2,
                                    label: "2 - Forced deviation, or total gaze paresis not overcome by oculocephalic maneuver",
                                },
                            ]}
                            value={scores["2"]}
                            onChange={(value) => handleScoreChange("2", value)}
                        />

                        {/* Section 3: Visual */}
                        <NIHSSQuestion
                            id="3"
                            title="3. Visual"
                            instructions="Visual fields tested by confrontation, using finger counting or visual threat."
                            options={[
                                { value: 0, label: "0 - No visual loss" },
                                { value: 1, label: "1 - Partial hemianopia" },
                                { value: 2, label: "2 - Complete hemianopia" },
                                {
                                    value: 3,
                                    label: "3 - Bilateral hemianopia (blind including cortical blindness)",
                                },
                            ]}
                            value={scores["3"]}
                            onChange={(value) => handleScoreChange("3", value)}
                        />

                        {/* Section 4: Facial Palsy */}
                        <NIHSSQuestion
                            id="4"
                            title="4. Facial Palsy"
                            instructions="Ask patient to show teeth or raise eyebrows and close eyes."
                            options={[
                                {
                                    value: 0,
                                    label: "0 - Normal symmetrical movements",
                                },
                                {
                                    value: 1,
                                    label: "1 - Minor paralysis (flattened nasolabial fold, asymmetry on smiling)",
                                },
                                {
                                    value: 2,
                                    label: "2 - Partial paralysis (total or near-total paralysis of lower face)",
                                },
                                {
                                    value: 3,
                                    label: "3 - Complete paralysis of one or both sides",
                                },
                            ]}
                            value={scores["4"]}
                            onChange={(value) => handleScoreChange("4", value)}
                        />

                        {/* Section 5: Motor Arm */}
                        <div className="border-b py-3">
                            <h3 className="font-medium text-base mb-2 text-gray-700 border-l-4 border-clinical-slate pl-2">
                                Motor Arm
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">
                                Extend arms (palms down) 90° if sitting or 45°
                                if supine.
                            </p>

                            <NIHSSTimer
                                duration={10}
                                title="ARM DRIFT TIMER - 10 SECONDS"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                {/* Motor Arm Headers */}
                                <div className="bg-blue-600/90 text-white py-1.5 px-3 rounded-t-md font-medium text-center">
                                    LEFT ARM
                                </div>
                                <div className="bg-red-600/90 text-white py-1.5 px-3 rounded-t-md font-medium text-center">
                                    RIGHT ARM
                                </div>

                                {/* Motor Arm Content */}
                                <div className="border border-blue-200/70 rounded-b-md p-2">
                                    {/* 5a Left Motor Arm */}
                                    <NIHSSQuestion
                                        id="5a"
                                        title="5a. Left Arm"
                                        instructions="Drift is scored if the arm falls before 10 seconds."
                                        options={[
                                            {
                                                value: 0,
                                                label: "0 - No drift; limb holds 90 (or 45) degrees for full 10 seconds",
                                            },
                                            {
                                                value: 1,
                                                label: "1 - Drift; limb holds position but drifts down before full 10 seconds",
                                            },
                                            {
                                                value: 2,
                                                label: "2 - Some effort against gravity; limb cannot get to or maintain position",
                                            },
                                            {
                                                value: 3,
                                                label: "3 - No effort against gravity; limb falls",
                                            },
                                            {
                                                value: 4,
                                                label: "4 - No movement",
                                            },
                                            {
                                                value: null,
                                                label: "UN - Amputation or joint fusion",
                                                isSpecial: true,
                                            },
                                        ]}
                                        value={scores["5a"]}
                                        onChange={(value) =>
                                            handleScoreChange("5a", value)
                                        }
                                    />
                                </div>
                                <div className="border border-red-200/70 rounded-b-md p-2">
                                    {/* 5b Right Motor Arm */}
                                    <NIHSSQuestion
                                        id="5b"
                                        title="5b. Right Arm"
                                        instructions="Drift is scored if the arm falls before 10 seconds."
                                        options={[
                                            {
                                                value: 0,
                                                label: "0 - No drift; limb holds 90 (or 45) degrees for full 10 seconds",
                                            },
                                            {
                                                value: 1,
                                                label: "1 - Drift; limb holds position but drifts down before full 10 seconds",
                                            },
                                            {
                                                value: 2,
                                                label: "2 - Some effort against gravity; limb cannot get to or maintain position",
                                            },
                                            {
                                                value: 3,
                                                label: "3 - No effort against gravity; limb falls",
                                            },
                                            {
                                                value: 4,
                                                label: "4 - No movement",
                                            },
                                            {
                                                value: null,
                                                label: "UN - Amputation or joint fusion",
                                                isSpecial: true,
                                            },
                                        ]}
                                        value={scores["5b"]}
                                        onChange={(value) =>
                                            handleScoreChange("5b", value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 6: Motor Leg */}
                        <div className="border-b py-3">
                            <h3 className="font-medium text-base mb-2 text-gray-700 border-l-4 border-clinical-slate pl-2">
                                Motor Leg
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">
                                Hold the leg at 30° (always tested supine).
                            </p>

                            <NIHSSTimer
                                duration={5}
                                title="LEG DRIFT TIMER - 5 SECONDS"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                {/* Motor Leg Headers */}
                                <div className="bg-blue-600/90 text-white py-1.5 px-3 rounded-t-md font-medium text-center">
                                    LEFT LEG
                                </div>
                                <div className="bg-red-600/90 text-white py-1.5 px-3 rounded-t-md font-medium text-center">
                                    RIGHT LEG
                                </div>

                                {/* Motor Leg Content */}
                                <div className="border border-blue-200/70 rounded-b-md p-2">
                                    {/* 6a Left Motor Leg */}
                                    <NIHSSQuestion
                                        id="6a"
                                        title="6a. Left Leg"
                                        instructions="Drift is scored if the leg falls before 5 seconds."
                                        options={[
                                            {
                                                value: 0,
                                                label: "0 - No drift; leg holds 30-degree position for full 5 seconds",
                                            },
                                            {
                                                value: 1,
                                                label: "1 - Drift; leg falls by the end of the 5-second period but does not hit bed",
                                            },
                                            {
                                                value: 2,
                                                label: "2 - Some effort against gravity; leg falls to bed by 5 seconds",
                                            },
                                            {
                                                value: 3,
                                                label: "3 - No effort against gravity; leg falls to bed immediately",
                                            },
                                            {
                                                value: 4,
                                                label: "4 - No movement",
                                            },
                                            {
                                                value: null,
                                                label: "UN - Amputation or joint fusion",
                                                isSpecial: true,
                                            },
                                        ]}
                                        value={scores["6a"]}
                                        onChange={(value) =>
                                            handleScoreChange("6a", value)
                                        }
                                    />
                                </div>
                                <div className="border border-red-200/70 rounded-b-md p-2">
                                    {/* 6b Right Motor Leg */}
                                    <NIHSSQuestion
                                        id="6b"
                                        title="6b. Right Leg"
                                        instructions="Drift is scored if the leg falls before 5 seconds."
                                        options={[
                                            {
                                                value: 0,
                                                label: "0 - No drift; leg holds 30-degree position for full 5 seconds",
                                            },
                                            {
                                                value: 1,
                                                label: "1 - Drift; leg falls by the end of the 5-second period but does not hit bed",
                                            },
                                            {
                                                value: 2,
                                                label: "2 - Some effort against gravity; leg falls to bed by 5 seconds",
                                            },
                                            {
                                                value: 3,
                                                label: "3 - No effort against gravity; leg falls to bed immediately",
                                            },
                                            {
                                                value: 4,
                                                label: "4 - No movement",
                                            },
                                            {
                                                value: null,
                                                label: "UN - Amputation or joint fusion",
                                                isSpecial: true,
                                            },
                                        ]}
                                        value={scores["6b"]}
                                        onChange={(value) =>
                                            handleScoreChange("6b", value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 7: Limb Ataxia */}
                        <NIHSSQuestion
                            id="7"
                            title="7. Limb Ataxia"
                            instructions="Finger-nose-finger and heel-shin tests are performed on both sides."
                            options={[
                                { value: 0, label: "0 - Absent" },
                                { value: 1, label: "1 - Present in one limb" },
                                { value: 2, label: "2 - Present in two limbs" },
                                {
                                    value: null,
                                    label: "UN - Amputation or joint fusion",
                                    isSpecial: true,
                                },
                            ]}
                            value={scores["7"]}
                            onChange={(value) => handleScoreChange("7", value)}
                        />

                        {/* Section 8: Sensory */}
                        <NIHSSQuestion
                            id="8"
                            title="8. Sensory"
                            instructions="Sensation or grimace to pinprick when tested, or withdrawal from noxious stimulus in the obtunded or aphasic patient."
                            options={[
                                {
                                    value: 0,
                                    label: "0 - Normal; no sensory loss",
                                },
                                {
                                    value: 1,
                                    label: "1 - Mild-to-moderate sensory loss",
                                },
                                {
                                    value: 2,
                                    label: "2 - Severe or total sensory loss",
                                },
                            ]}
                            value={scores["8"]}
                            onChange={(value) => handleScoreChange("8", value)}
                        />

                        {/* Section 9: Best Language */}
                        <NIHSSQuestion
                            id="9"
                            title="9. Best Language"
                            instructions="Patient is asked to describe a picture, name items, read sentences."
                            options={[
                                { value: 0, label: "0 - No aphasia; normal" },
                                {
                                    value: 1,
                                    label: "1 - Mild-to-moderate aphasia",
                                },
                                { value: 2, label: "2 - Severe aphasia" },
                                {
                                    value: 3,
                                    label: "3 - Mute, global aphasia; no usable speech or auditory comprehension",
                                },
                            ]}
                            value={scores["9"]}
                            onChange={(value) => handleScoreChange("9", value)}
                        />

                        {/* Section 10: Dysarthria */}
                        <NIHSSQuestion
                            id="10"
                            title="10. Dysarthria"
                            instructions="Patient is asked to read or repeat words from a list."
                            options={[
                                { value: 0, label: "0 - Normal" },
                                {
                                    value: 1,
                                    label: "1 - Mild-to-moderate dysarthria",
                                },
                                { value: 2, label: "2 - Severe dysarthria" },
                                {
                                    value: null,
                                    label: "UN - Intubated or other physical barrier",
                                    isSpecial: true,
                                },
                            ]}
                            value={scores["10"]}
                            onChange={(value) => handleScoreChange("10", value)}
                        />

                        {/* Section 11: Extinction and Inattention */}
                        <NIHSSQuestion
                            id="11"
                            title="11. Extinction and Inattention"
                            instructions="Sufficient information to identify neglect may be obtained during prior testing."
                            options={[
                                { value: 0, label: "0 - No abnormality" },
                                {
                                    value: 1,
                                    label: "1 - Visual, tactile, auditory, spatial, or personal inattention",
                                },
                                {
                                    value: 2,
                                    label: "2 - Profound hemi-inattention or extinction",
                                },
                            ]}
                            value={scores["11"]}
                            onChange={(value) => handleScoreChange("11", value)}
                        />

                        {/* Bottom score summary and reset button */}
                        <div className="mt-8">
                            <NIHSSScore
                                totalScore={totalScore}
                                severity={severity}
                                isComplete={Object.values(scores).every(
                                    (s) => s !== null
                                )}
                                progress={
                                    (Object.values(scores).filter(
                                        (s) => s !== null
                                    ).length /
                                        Object.keys(scores).length) *
                                    100
                                }
                                completedQuestions={
                                    Object.values(scores).filter(
                                        (s) => s !== null
                                    ).length
                                }
                                totalQuestions={Object.keys(scores).length}
                                showReset={true}
                                onReset={resetScores}
                            />
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
