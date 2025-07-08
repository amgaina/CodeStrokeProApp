/**
 * Author: Abhishek Amgain and Dinesh Chhantyal
 * Version: 1.0.0
 * File Description: 
 *     This file defines the Mission (SectionA) component for the CodeStroke Pro application.
 *     It presents the application's mission statement, call-to-action buttons, and key features
 *     in a visually engaging and accessible layout for clinicians and stakeholders.
 */
'use client';

import Link from 'next/link';
import {
    ChevronRight,
    BookOpen,
    Activity,
    Shield,
    Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Mission() {
    return (
        <section
            id="mission"
            /* ⬇️ Full-screen height, flex center */
            className="relative isolate flex min-h-[100dvh] flex-col justify-center bg-parchment/5 px-4 pb-12 pt-16 sm:px-6 sm:py-24 lg:px-8"
        >
            <div className="mx-auto max-w-4xl text-center">
                {/* Tagline */}
                <p className="mb-2 text-base font-semibold tracking-wide text-vital-green">
                    Public-Service Initiative
                </p>

                {/* Heading */}
                <h2 className="mb-6 text-3xl font-semibold leading-tight text-deep-charcoal sm:text-4xl">
                    Rapid, Reliable Stroke Care
                </h2>

                {/* Body */}
                <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-deep-charcoal/80">
                    CodeStroke Pro is a free, evidence-based tool guiding clinicians through
                    eligibility, dosing, and monitoring—helping teams treat stroke patients faster
                    and safer.
                </p>

                {/* CTAs */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        asChild
                        size="lg"
                        className="bg-clinical-slate text-parchment hover:bg-clinical-slate/90 px-8 py-4"
                    >
                        <Link href="/calculator">
                            Start Workflow
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="border-harbor-gray text-deep-charcoal hover:bg-harbor-gray/20 px-8 py-4"
                    >
                        <Link href="#resources">
                            Resources
                            <BookOpen className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                {/* Stats banner */}
                <div className="mt-12 rounded-lg border border-vital-green/20 bg-gradient-to-r from-vital-green/10 to-clinical-slate/10 p-6">
                    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {/* Community */}
                        <div className="flex flex-col items-center sm:flex-row sm:text-left">
                            <span className="mb-2 rounded-full bg-vital-green/20 p-2 sm:mb-0 sm:mr-3">
                                <Activity className="h-5 w-5 text-vital-green" />
                            </span>
                            <div>
                                <dt className="text-sm font-medium text-deep-charcoal">
                                    Community Focus
                                </dt>
                                <dd className="text-xs text-deep-charcoal/70">
                                    Northeast Louisiana
                                </dd>
                            </div>
                        </div>

                        {/* Open access */}
                        <div className="flex flex-col items-center sm:flex-row sm:text-left">
                            <span className="mb-2 rounded-full bg-clinical-slate/20 p-2 sm:mb-0 sm:mr-3">
                                <Shield className="h-5 w-5 text-clinical-slate" />
                            </span>
                            <div>
                                <dt className="text-sm font-medium text-deep-charcoal">
                                    Open Access
                                </dt>
                                <dd className="text-xs text-deep-charcoal/70">Non-commercial</dd>
                            </div>
                        </div>

                        {/* Evidence-based */}
                        <div className="flex flex-col items-center sm:flex-row sm:text-left">
                            <span className="mb-2 rounded-full bg-vital-green/20 p-2 sm:mb-0 sm:mr-3">
                                <Stethoscope className="h-5 w-5 text-vital-green" />
                            </span>
                            <div>
                                <dt className="text-sm font-medium text-deep-charcoal">
                                    Evidence-Based
                                </dt>
                                <dd className="text-xs text-deep-charcoal/70">Guideline Driven</dd>
                            </div>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    );
}
