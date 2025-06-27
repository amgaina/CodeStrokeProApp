"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Timer, AlertTriangle } from "lucide-react";

interface TimerState {
    lkwTime: Date | null;
    arrivalTime: Date | null;
    currentTime: Date;
}

interface CodeStrokeTimersProps {
    timers: TimerState;
    onStartArrivalTimer: () => void;
    onNext: () => void;
    onBack?: () => void;
}

export default function CodeStrokeTimers({
    timers,
    onStartArrivalTimer,
    onNext,
    onBack,
}: CodeStrokeTimersProps) {
    const formatTimeRemaining = (
        targetTime: Date,
        currentTime: Date
    ): { text: string; isExpired: boolean } => {
        const diff = targetTime.getTime() - currentTime.getTime();
        const isExpired = diff <= 0;

        if (isExpired) {
            return { text: "EXPIRED", isExpired: true };
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { text: `${hours}h ${minutes}m ${seconds}s`, isExpired: false };
    };

    const formatElapsedTime = (startTime: Date, currentTime: Date): string => {
        const diff = Math.max(0, currentTime.getTime() - startTime.getTime());
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Clinical Warning */}
            <Alert className="border-urgent-amber/30 bg-urgent-amber/10 clarity-shadow">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-urgent-amber" />
                <AlertDescription className="text-deep-charcoal font-medium text-sm md:text-base">
                    <strong className="text-urgent-amber">Important:</strong>
                    Do not close this application. Timers will reset if the page
                    is closed.
                </AlertDescription>
            </Alert>

            {/* Mobile Layout - Stacked */}
            <div className="block lg:hidden space-y-4">
                {/* 4.5 Hour Window Timer - Mobile */}
                <Card className="shadow-xl border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Clock className="w-4 h-4" />
                            4.5 Hour Thrombolytic Window
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {timers.lkwTime && (
                            <div className="text-center">
                                {(() => {
                                    const fourHourLimit = new Date(
                                        timers.lkwTime.getTime() +
                                            4.5 * 60 * 60 * 1000
                                    );
                                    const timeRemaining = formatTimeRemaining(
                                        fourHourLimit,
                                        timers.currentTime
                                    );
                                    return (
                                        <div
                                            className={`p-4 rounded-xl ${
                                                timeRemaining.isExpired
                                                    ? "bg-red-50 border-2 border-red-200"
                                                    : "bg-green-50 border-2 border-green-200"
                                            }`}
                                        >
                                            <p
                                                className={`text-xs mb-2 ${
                                                    timeRemaining.isExpired
                                                        ? "text-red-700"
                                                        : "text-green-700"
                                                }`}
                                            >
                                                {timeRemaining.isExpired
                                                    ? "Thrombolytic Window Expired"
                                                    : "Time Remaining for IV Thrombolytics"}
                                            </p>
                                            <p
                                                className={`text-2xl md:text-4xl font-bold ${
                                                    timeRemaining.isExpired
                                                        ? "text-red-800"
                                                        : "text-green-800"
                                                }`}
                                            >
                                                {timeRemaining.text}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-2">
                                                LKW:{" "}
                                                {timers.lkwTime.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Door-to-Needle Timer - Mobile */}
                <Card className="shadow-xl border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Timer className="w-4 h-4" />
                            Door-to-Needle Timer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {!timers.arrivalTime ? (
                            <div className="text-center space-y-4">
                                <p className="text-gray-600 text-sm">
                                    Start timer when patient arrives to
                                    Emergency Department
                                </p>
                                <Button
                                    onClick={onStartArrivalTimer}
                                    className="w-full bg-red-600 hover:bg-red-700 text-base md:text-lg py-3 md:py-4"
                                    size="lg"
                                >
                                    <Timer className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                    START CODE STROKE
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                <p className="text-xs text-blue-700 mb-2">
                                    Time Since ED Arrival
                                </p>
                                <p className="text-2xl md:text-4xl font-bold text-blue-800">
                                    {formatElapsedTime(
                                        timers.arrivalTime,
                                        timers.currentTime
                                    )}
                                </p>
                                <Badge className="mt-2 bg-red-600 text-xs">
                                    CODE STROKE ACTIVE
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Desktop Layout - Side by Side */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-6">
                {/* 4.5 Hour Window Timer - Desktop */}
                <Card className="shadow-xl border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            4.5 Hour Thrombolytic Window
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {timers.lkwTime && (
                            <div className="text-center">
                                {(() => {
                                    const fourHourLimit = new Date(
                                        timers.lkwTime.getTime() +
                                            4.5 * 60 * 60 * 1000
                                    );
                                    const timeRemaining = formatTimeRemaining(
                                        fourHourLimit,
                                        timers.currentTime
                                    );
                                    return (
                                        <div
                                            className={`p-6 rounded-xl ${
                                                timeRemaining.isExpired
                                                    ? "bg-red-50 border-2 border-red-200"
                                                    : "bg-green-50 border-2 border-green-200"
                                            }`}
                                        >
                                            <p
                                                className={`text-sm mb-2 ${
                                                    timeRemaining.isExpired
                                                        ? "text-red-700"
                                                        : "text-green-700"
                                                }`}
                                            >
                                                {timeRemaining.isExpired
                                                    ? "Thrombolytic Window Expired"
                                                    : "Time Remaining for IV Thrombolytics"}
                                            </p>
                                            <p
                                                className={`text-4xl font-bold ${
                                                    timeRemaining.isExpired
                                                        ? "text-red-800"
                                                        : "text-green-800"
                                                }`}
                                            >
                                                {timeRemaining.text}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-2">
                                                LKW:{" "}
                                                {timers.lkwTime.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Door-to-Needle Timer - Desktop */}
                <Card className="shadow-xl border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <CardTitle className="flex items-center gap-2">
                            <Timer className="w-5 h-5" />
                            Door-to-Needle Timer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {!timers.arrivalTime ? (
                            <div className="text-center space-y-4">
                                <p className="text-gray-600">
                                    Start timer when patient arrives to
                                    Emergency Department
                                </p>
                                <Button
                                    onClick={onStartArrivalTimer}
                                    className="w-full bg-red-600 hover:bg-red-700 text-lg py-4"
                                    size="lg"
                                >
                                    <Timer className="w-5 h-5 mr-2" />
                                    START CODE STROKE
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                <p className="text-sm text-blue-700 mb-2">
                                    Time Since ED Arrival
                                </p>
                                <p className="text-4xl font-bold text-blue-800">
                                    {formatElapsedTime(
                                        timers.arrivalTime,
                                        timers.currentTime
                                    )}
                                </p>
                                <Badge className="mt-2 bg-red-600">
                                    CODE STROKE ACTIVE
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                {onBack && (
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                    >
                        Back to LKW Time
                    </Button>
                )}
                <Button
                    onClick={onNext}
                    className="bg-blue-600 hover:bg-blue-700 text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                    disabled={!timers.arrivalTime}
                >
                    Continue to Eligibility Screening
                </Button>
            </div>
        </div>
    );
}
