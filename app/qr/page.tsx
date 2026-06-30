"use client";

import { useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { QrCode, Download, Copy, Check } from "lucide-react";

// Pages a QR code can point at. Label is what the organizer sees.
const TARGETS = [
    { value: "/", label: "Home page" },
    { value: "/calculator", label: "Dosing Calculator (full)" },
    { value: "/fast-calc", label: "Quick Dosing Calculator" },
    { value: "/nihss", label: "NIHSS" },
    { value: "/cpss", label: "Cincinnati (CPSS)" },
    { value: "/van", label: "VAN" },
    { value: "/resources", label: "Resources" },
];

// "ULM Spring 2026!" -> "ulm-spring-2026"
function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function QrGeneratorPage() {
    const [session, setSession] = useState("");
    const [target, setTarget] = useState("/");
    const [copied, setCopied] = useState(false);
    const canvasWrapRef = useRef<HTMLDivElement>(null);

    const campaign = slugify(session);

    // Built against the current origin, so it works on any domain it runs on.
    const url = useMemo(() => {
        const origin =
            typeof window !== "undefined"
                ? window.location.origin
                : "https://codestrokepro.org";
        const u = new URL(target || "/", origin);
        u.searchParams.set("utm_source", "qr");
        u.searchParams.set("utm_medium", "training");
        if (campaign) u.searchParams.set("utm_campaign", campaign);
        return u.toString();
    }, [target, campaign]);

    const ready = campaign.length > 0;

    const downloadPng = () => {
        const canvas = canvasWrapRef.current?.querySelector("canvas");
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `qr-${campaign || "codestrokepro"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard blocked; user can still read the URL on screen */
        }
    };

    return (
        <div className="min-h-screen bg-parchment">
            <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
                <div className="mb-6 text-center">
                    <h1 className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-semibold text-deep-charcoal">
                        <QrCode className="h-7 w-7 text-clinical-slate" />
                        Training QR Codes
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Name a training session and download a QR code for it.
                        Each code tracks that session&apos;s usage separately,
                        with no patient data.
                    </p>
                </div>

                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Create a code
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="session">Session name</Label>
                                <Input
                                    id="session"
                                    placeholder="e.g. ULM Spring 2026"
                                    value={session}
                                    onChange={(e) =>
                                        setSession(e.target.value)
                                    }
                                />
                                {ready && (
                                    <p className="text-xs text-gray-500">
                                        Tag: {campaign}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="target">Opens to</Label>
                                <Select
                                    value={target}
                                    onValueChange={setTarget}
                                >
                                    <SelectTrigger id="target">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TARGETS.map((t) => (
                                            <SelectItem
                                                key={t.value}
                                                value={t.value}
                                            >
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
                            <div
                                ref={canvasWrapRef}
                                className={
                                    ready ? "opacity-100" : "opacity-30"
                                }
                            >
                                <QRCodeCanvas
                                    value={url}
                                    size={220}
                                    level="H"
                                    marginSize={4}
                                    className="rounded bg-white"
                                />
                            </div>

                            <div className="w-full break-all rounded bg-white px-3 py-2 text-center text-xs text-gray-600 border border-gray-200">
                                {url}
                            </div>

                            <div className="flex flex-wrap justify-center gap-3">
                                <Button
                                    onClick={downloadPng}
                                    disabled={!ready}
                                    className="bg-clinical-slate text-white hover:bg-clinical-slate/90"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PNG
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={copyUrl}
                                    disabled={!ready}
                                >
                                    {copied ? (
                                        <Check className="mr-2 h-4 w-4 text-vital-green" />
                                    ) : (
                                        <Copy className="mr-2 h-4 w-4" />
                                    )}
                                    {copied ? "Copied" : "Copy link"}
                                </Button>
                            </div>
                            {!ready && (
                                <p className="text-xs text-gray-500">
                                    Enter a session name to enable download.
                                </p>
                            )}
                        </div>

                        <p className="text-center text-xs text-gray-500">
                            Tip: give each session a different name (ULM Spring
                            2026, Ochsner Jan, EMS Workshop 3) so you can compare
                            them in the analytics later.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
