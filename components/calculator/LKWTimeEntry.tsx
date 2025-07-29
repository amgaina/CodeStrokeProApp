/**
 * Author: Abhishek Amgain and Dinesh Chhantyal
 * Version: 1.0.0
 * File Description:
 *     This file defines the LKWTimeEntry component for the CodeStroke Pro application.
 *     It provides an interactive UI for clinicians to enter or select the patient's
 *     Last-Known-Well (LKW) time, supporting quick presets, manual entry, local storage
 *     persistence, and real-time eligibility countdown for acute stroke workflows.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LS_KEY = 'csp-lkw-time';

/* quick presets */
const presets = [
    { label: 'Now', offset: 0 },
    { label: '15 m', offset: 15 },
    { label: '30 m', offset: 30 },
    { label: '45 m', offset: 45 },
    { label: '1 h', offset: 60 },
];

/* helpers */
function fromClock(t: string, now = new Date()): Date | null {
    const [h, m] = t.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    if (d > now) d.setDate(d.getDate() - 1);
    return d;
}
function clamp(d: Date, now = new Date()) {
    const past48 = now.getTime() - 48 * 60 * 60 * 1e3;
    return d.getTime() < past48 || d.getTime() > now.getTime() ? null : d;
}

/* props */
interface Props {
    lkwTime: Date | null;
    onTimeSet: (d: Date | null) => void;
    onNext: () => void;
}

/* component */
export default function LKWTimeEntry({ onTimeSet, onNext }: Props) {
    const [lkw, setLkw] = useState<Date | null>(null);
    const [manual, setManual] = useState('');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setNow(new Date()), 1000);
        // The cleanup function clears the interval when the component is removed.
        return () => clearInterval(timerId);
    }, []);

    /* hydrate */
    useEffect(() => {
        const iso = localStorage.getItem(LS_KEY);
        if (iso) {
            const d = new Date(iso);
            if (!Number.isNaN(d.getTime())) {
                setLkw(d);
                setManual(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                onTimeSet(d);
            }
        }
    }, []);

    /* persist */
    useEffect(() => {
        if (lkw) localStorage.setItem(LS_KEY, lkw.toISOString());
    }, [lkw]);

    // Memoized calculation for the countdown preview. Re-runs when LKW or 'now' changes.
    const preview = useMemo(() => {
        if (!lkw) return null;
        // Thrombolysis window is 4.5 hours.
        const windowMs = 4.5 * 60 * 60 * 1000;
        const elapsedMs = now.getTime() - lkw.getTime();
        const remainingMs = windowMs - elapsedMs;
        const overdue = remainingMs < 0;
        const absMs = Math.abs(remainingMs);

        return {
            overdue,
            hrs: Math.floor(absMs / 3_600_000),
            mins: Math.floor((absMs % 3_600_000) / 60_000),
            secs: Math.floor((absMs % 60_000) / 1000),
        };
    }, [lkw, now]);

    /* setters */
    function setAndSync(d: Date | null) {
        setLkw(d);
        onTimeSet(d);
        if (d) {
            setManual(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        } else {
            setManual('');
            localStorage.removeItem(LS_KEY);
        }
    }
    const choosePreset = (min: number) => setAndSync(new Date(Date.now() - min * 60_000));
    const handleManual = (val: string) => {
        setManual(val);
        const d = clamp(fromClock(val) as Date);
        if (d) setAndSync(d);
    };

    /* UI */
    return (
        <Card className="border border-harbor-gray bg-white shadow-sm">
            <CardHeader className="rounded-t-lg bg-clinical-slate px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-parchment md:text-xl">
                    <Clock className="h-5 w-5 md:h-6 md:w-6" />
                    Last-Known-Well Time
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 px-4 py-6 md:px-8 md:py-8">
                <div className="text-center space-y-1">
                    <p className="text-base font-semibold text-deep-charcoal md:text-lg">
                        When was the patient last seen normal?
                    </p>
                    <p className="mx-auto max-w-xs text-sm text-deep-charcoal/70">
                        Tap a preset or enter a clock time.
                    </p>
                </div>

                {/* presets */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {presets.map(({ label, offset }) => (
                        <Button
                            key={label}
                            size="sm"
                            variant="outline"
                            onClick={() => choosePreset(offset)}
                            className="rounded-full text-xs sm:text-sm px-3 py-1.5"
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                {/* manual input — spinner arrows hidden via appearance-none */}
                <div className="flex justify-center">
                    <Label htmlFor="lkw-time" className="sr-only">
                        LKW time input
                    </Label>
                    <Input
                        id="lkw-time"
                        type="time"
                        step="60"
                        value={manual}
                        onChange={(e) => handleManual(e.target.value)}
                        className="appearance-none h-12 w-40 max-w-full rounded-lg border-2 border-harbor-gray bg-parchment/50 p-2 text-center text-lg font-mono tracking-wide focus:border-clinical-slate sm:h-14 sm:text-xl"
                    />
                </div>

                {/* countdown */}
                {preview && (
                    <p
                        className={`mx-auto max-w-xs rounded-md px-3 py-2 text-center text-sm font-semibold ${preview.overdue ? 'bg-critical-crimson/20 text-critical-crimson' : 'bg-vital-green/20 text-vital-green'
                            }`}
                    >
                        {`${preview.hrs}h ${preview.mins}m ${preview.overdue ? 'past window' : 'left'}`}
                    </p>
                )}

                <Button
                    onClick={onNext}
                    disabled={!lkw || preview?.overdue}
                    className="mx-auto flex flex-end w-full rounded-lg bg-clinical-slate px-6 py-3 text-base text-parchment hover:bg-clinical-slate/90 sm:w-auto sm:text-lg"
                >
                    Continue
                </Button>

                {lkw && (
                    <button
                        onClick={() => setAndSync(null)}
                        className="mx-auto block text-xs text-black underline hover:text-red-600"
                    >
                        Clear &amp; reset time
                    </button>
                )}
            </CardContent>
        </Card>
    );
}