"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Timer,
    AlertTriangle,
    CheckCircle,
    Activity,
} from "lucide-react";

interface TimerState {
    lkwTime: Date | null;
    arrivalTime: Date | null;
    currentTime: Date;
}

interface TimerComponentProps {
    timers: TimerState;
    setTimers: (timers: TimerState) => void;
    currentStep: string;
    onNext: () => void;
}

export default function TimerComponent({
    timers,
    setTimers,
    currentStep,
    onNext,
}: TimerComponentProps) {
    const [lkwInput, setLkwInput] = useState("");
    const [arrivalInput, setArrivalInput] = useState("");

    const formatTimeRemaining = (
        targetTime: Date,
        currentTime: Date
    ): { text: string; isExpired: boolean } => {
        const diff = targetTime.getTime() - currentTime.getTime();
        const isExpired = diff <= 0;

        if (isExpired) {
            const overTime = Math.abs(diff);
            const hours = Math.floor(overTime / (1000 * 60 * 60));
            const minutes = Math.floor(
                (overTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            return {
                text: `EXPIRED by ${hours}h ${minutes}m`,
                isExpired: true,
            };
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { text: `${hours}h ${minutes}m ${seconds}s`, isExpired: false };
    };

    const formatElapsedTime = (startTime: Date, currentTime: Date): string => {
        const diff = currentTime.getTime() - startTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const handleLkwSubmit = () => {
        if (lkwInput) {
            const lkwTime = new Date(lkwInput);
            setTimers({ ...timers, lkwTime });
            onNext(); // Move to timers step
        }
    };

    const handleArrivalSubmit = () => {
        if (arrivalInput) {
            const arrivalTime = new Date(arrivalInput);
            setTimers({ ...timers, arrivalTime });
            onNext(); // Move to screening step
        }
    };

    // LKW Timer Step
    if (currentStep === "lkw") {
        return (
            <div className="space-y-6">
                <Card className="bg-white/80 shadow-lg border-clinical-slate/20">
                    <CardHeader className="bg-clinical-slate/5 border-b border-clinical-slate/10">
                        <CardTitle className="flex items-center space-x-3 text-clinical-slate">
                            <Clock className="w-6 h-6 text-harbor-gray" />
                            <span>Step 1: Last Known Well Time</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <p className="text-clinical-slate/80 mb-4">
                            Enter the time when the patient was last known to be
                            well (without stroke symptoms).
                        </p>
                        <div className="space-y-2">
                            <Label
                                htmlFor="lkw-time"
                                className="text-clinical-slate font-medium"
                            >
                                Last Known Well Time
                            </Label>
                            <Input
                                id="lkw-time"
                                type="datetime-local"
                                value={lkwInput}
                                onChange={(e) => setLkwInput(e.target.value)}
                                className="border-clinical-slate/30 focus:border-harbor-gray"
                            />
                        </div>
                        <div className="pt-4">
                            <Button
                                onClick={handleLkwSubmit}
                                disabled={!lkwInput}
                                className="w-full bg-harbor-gray hover:bg-harbor-gray/90 text-white"
                            >
                                Set Last Known Well Time
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Code Stroke Timer Step
    if (currentStep === "timers") {
        const lkwWindow = timers.lkwTime
            ? new Date(timers.lkwTime.getTime() + 4.5 * 60 * 60 * 1000)
            : null;
        const treatmentWindow = timers.arrivalTime
            ? new Date(timers.arrivalTime.getTime() + 60 * 60 * 1000)
            : null;

        return (
            <div className="space-y-6">
                {/* LKW Timer Display */}
                {timers.lkwTime && lkwWindow && (
                    <Card className="bg-white/80 shadow-lg border-clinical-slate/20">
                        <CardHeader className="bg-clinical-slate/5 border-b border-clinical-slate/10">
                            <CardTitle className="flex items-center space-x-3 text-clinical-slate">
                                <Timer className="w-6 h-6 text-harbor-gray" />
                                <span>4.5 Hour Treatment Window</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {(() => {
                                const remaining = formatTimeRemaining(
                                    lkwWindow,
                                    timers.currentTime
                                );
                                return (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-clinical-slate/70 mb-1">
                                                Last Known Well:{" "}
                                                {timers.lkwTime.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-clinical-slate/70">
                                                Window Closes:{" "}
                                                {lkwWindow.toLocaleString()}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                remaining.isExpired
                                                    ? "destructive"
                                                    : "default"
                                            }
                                            className={`text-lg px-4 py-2 ${
                                                remaining.isExpired
                                                    ? "bg-red-100 text-red-800 border-red-200"
                                                    : "bg-green-100 text-green-800 border-green-200"
                                            }`}
                                        >
                                            {remaining.isExpired ? (
                                                <AlertTriangle className="w-5 h-5 mr-2" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                            )}
                                            {remaining.text}
                                        </Badge>
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>
                )}

                {/* Code Stroke Timer */}
                <Card className="bg-white/80 shadow-lg border-clinical-slate/20">
                    <CardHeader className="bg-clinical-slate/5 border-b border-clinical-slate/10">
                        <CardTitle className="flex items-center space-x-3 text-clinical-slate">
                            <Activity className="w-6 h-6 text-harbor-gray" />
                            <span>Step 2: Code Stroke Timer</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <p className="text-clinical-slate/80 mb-4">
                            Enter the time when the Code Stroke was activated
                            (patient arrival or activation time).
                        </p>
                        <div className="space-y-2">
                            <Label
                                htmlFor="arrival-time"
                                className="text-clinical-slate font-medium"
                            >
                                Code Stroke Activation Time
                            </Label>
                            <Input
                                id="arrival-time"
                                type="datetime-local"
                                value={arrivalInput}
                                onChange={(e) =>
                                    setArrivalInput(e.target.value)
                                }
                                className="border-clinical-slate/30 focus:border-harbor-gray"
                            />
                        </div>

                        {/* Treatment Window Timer */}
                        {timers.arrivalTime && treatmentWindow && (
                            <div className="mt-4 p-4 bg-clinical-slate/5 rounded-lg border border-clinical-slate/10">
                                {(() => {
                                    const remaining = formatTimeRemaining(
                                        treatmentWindow,
                                        timers.currentTime
                                    );
                                    const elapsed = formatElapsedTime(
                                        timers.arrivalTime!,
                                        timers.currentTime
                                    );
                                    return (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-clinical-slate">
                                                    60-Minute Treatment Goal
                                                </span>
                                                <Badge
                                                    variant={
                                                        remaining.isExpired
                                                            ? "destructive"
                                                            : "default"
                                                    }
                                                    className={
                                                        remaining.isExpired
                                                            ? "bg-red-100 text-red-800 border-red-200"
                                                            : "bg-green-100 text-green-800 border-green-200"
                                                    }
                                                >
                                                    {remaining.text}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-clinical-slate/70">
                                                Elapsed since arrival: {elapsed}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        <div className="pt-4">
                            <Button
                                onClick={handleArrivalSubmit}
                                disabled={!arrivalInput}
                                className="w-full bg-harbor-gray hover:bg-harbor-gray/90 text-white"
                            >
                                Start Code Stroke Timer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}
