"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, RotateCcw } from "lucide-react";

interface NIHSSTimerProps {
    duration: number; // in seconds
    title: string;
}

export default function NIHSSTimer({ duration, title }: NIHSSTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Calculate percentage of time elapsed (not remaining)
    const percentElapsed = Math.max(
        0,
        Math.min(100, 100 - ((timeLeft / duration) * 100))
    );

    // Determine color based on time left
    const getColor = () => {
        const percentRemaining = 100 - percentElapsed;
        if (percentRemaining > 66) return "#22c55e"; // green-500
        if (percentRemaining > 33) return "#f59e0b"; // amber-500
        return "#ef4444"; // red-500
    };

    // Format time as seconds.tenths
    const formatTime = (time: number) => {
        const seconds = Math.floor(time);
        const tenths = Math.floor((time - seconds) * 10);
        return `${seconds}.${tenths}`;
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    const newTime = prev - 0.1;
                    if (newTime <= 0) {
                        setIsRunning(false);
                        setIsComplete(true);
                        return 0;
                    }
                    return Number(newTime.toFixed(1));
                });
            }, 100);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            setIsComplete(true);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft]);

    const startTimer = () => {
        setIsRunning(true);
        setIsComplete(false);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setIsComplete(false);
        setTimeLeft(duration);
    };

    return (
        <div className="w-full rounded-md border border-gray-200 bg-white p-2.5 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{title}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Time left:</span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded font-medium">
                        {formatTime(timeLeft)}s
                    </span>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${percentElapsed}%`,
                        backgroundColor: getColor(),
                        transition:
                            "width 100ms linear, background-color 200ms ease",
                    }}
                />
            </div>
            <div className="flex items-center justify-between mt-2">
                <button
                    onClick={resetTimer}
                    className="text-sm px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                </button>

                {isComplete && (
                    <span className="text-xs text-red-500 font-medium">
                        Time expired, reset to try again
                    </span>
                )}

                <div>
                    {isRunning ? (
                        <button
                            onClick={pauseTimer}
                            className="text-sm px-3 py-1 rounded-md bg-amber-100 hover:bg-amber-200 flex items-center gap-1"
                        >
                            <PauseCircle className="w-3 h-3" />
                            Pause
                        </button>
                    ) : (
                        <button
                            onClick={startTimer}
                            className="text-sm px-3 py-1 rounded-md bg-green-100 hover:bg-green-200 flex items-center gap-1"
                        >
                            <PlayCircle className="w-3 h-3" />
                            Start
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
