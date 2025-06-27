"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface LKWTimeEntryProps {
    lkwTime: Date | null;
    onTimeSet: (time: Date) => void;
    onNext: () => void;
}

// Utility function to determine the most appropriate LKW date/time
function calculateLKWDateTime(timeInput: string, currentTime: Date): Date | null {
    const [hours, minutes] = timeInput.split(":").map(Number);
    
    // Create candidate dates for today and yesterday
    const todayLKW = new Date(currentTime);
    todayLKW.setHours(hours, minutes, 0, 0);
    
    const yesterdayLKW = new Date(currentTime);
    yesterdayLKW.setDate(yesterdayLKW.getDate() - 1);
    yesterdayLKW.setHours(hours, minutes, 0, 0);
    
    // Calculate time differences
    const todayDiff = Math.abs(todayLKW.getTime() - currentTime.getTime());
    const yesterdayDiff = Math.abs(yesterdayLKW.getTime() - currentTime.getTime());
    
    // Choose the date that makes more clinical sense
    let lkwDateTime: Date;
    const twelveHours = 12 * 60 * 60 * 1000;
    
    if (todayLKW.getTime() > currentTime.getTime() + twelveHours) {
        // Today's time is far in the future, use yesterday
        lkwDateTime = yesterdayLKW;
    } else if (todayDiff <= yesterdayDiff) {
        // Today's time is closer or equal, use today
        lkwDateTime = todayLKW;
    } else {
        // Yesterday's time is closer, use yesterday
        lkwDateTime = yesterdayLKW;
    }
    
    // Clinical validation: LKW shouldn't be more than 48 hours ago
    const fortyEightHoursAgo = new Date(currentTime.getTime() - 48 * 60 * 60 * 1000);
    if (lkwDateTime < fortyEightHoursAgo) {
        return null; // Don't set unreasonably old times
    }
    
    // Clinical validation: LKW shouldn't be more than 2 hours in the future
    const twoHoursFromNow = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
    if (lkwDateTime > twoHoursFromNow) {
        return null; // Don't set unreasonably future times
    }
    
    return lkwDateTime;
}

export default function LKWTimeEntry({ lkwTime, onTimeSet, onNext }: LKWTimeEntryProps) {
    const setLKWTime = (timeInput: string) => {
        if (!timeInput) return;
        
        const now = new Date();
        const lkwDateTime = calculateLKWDateTime(timeInput, now);
        
        if (lkwDateTime) {
            onTimeSet(lkwDateTime);
        }
    };

    return (
        <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
            <CardHeader className="bg-clinical-slate text-parchment rounded-t-lg p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
                    <Clock className="w-5 h-5 md:w-6 md:h-6" />
                    Last Known Well Time Entry
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
                <div className="max-w-md mx-auto space-y-4 md:space-y-6">
                    <div className="text-center">
                        <h3 className="text-base md:text-lg font-semibold text-deep-charcoal mb-2">
                            When was the patient last seen normal?
                        </h3>
                        <p className="text-deep-charcoal/70 text-sm">
                            Enter the time the patient was last known to be without neurological symptoms
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="text-center">
                            <Label
                                htmlFor="lkw-time"
                                className="text-sm md:text-base font-medium text-deep-charcoal block mb-2"
                            >
                                Last Known Well Time
                            </Label>
                            <div className="flex justify-center">
                                <Input
                                    id="lkw-time"
                                    type="time"
                                    onChange={(e) => setLKWTime(e.target.value)}
                                    className="w-auto text-center text-base md:text-lg p-3 md:p-4 border-2 border-harbor-gray focus:border-clinical-slate rounded-lg"
                                />
                            </div>
                        </div>

                        {lkwTime && (
                            <div className="text-center p-3 md:p-4 bg-vital-green/10 border-2 border-vital-green/30 rounded-lg clarity-shadow">
                                <p className="text-sm text-vital-green mb-1">
                                    LKW Time Set
                                </p>
                                <p className="text-base md:text-lg font-semibold text-deep-charcoal">
                                    {lkwTime.toLocaleDateString([], {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}{' '}
                                    {lkwTime.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                                <p className="text-xs text-deep-charcoal/60 mt-1">
                                    {(() => {
                                        const now = new Date();
                                        const timeDiff = now.getTime() - lkwTime.getTime();
                                        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                                        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                                        const isToday = lkwTime.toDateString() === now.toDateString();
                                        const timeAgo = `${hours} hours ${minutes} minutes ago`;
                                        return isToday ? timeAgo : `${timeAgo} (${lkwTime.toDateString()})`;
                                    })()}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <Button
                            onClick={onNext}
                            className="bg-clinical-slate hover:bg-clinical-slate/90 text-parchment btn-text text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
                            disabled={!lkwTime}
                        >
                            Continue to Code Stroke Timer
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
