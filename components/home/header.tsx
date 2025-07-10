/**
 * Author: Abhishek Amgain and Dinesh Chhantyal
 * Version: 1.0.0
 * File Description:
 *     This file defines the Header component for the CodeStroke Pro application.
 *     It provides a responsive navigation bar with branding, navigation links,
 *     and animated mobile menu support using Framer Motion.
 */
// File: /components/home/header.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Stethoscope, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b border-harbor-gray bg-clinical-slate text-parchment clarity-shadow">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand */}
                <Link href="/" className="flex items-center space-x-3">
                    <span className="rounded-full bg-white/10 p-2">
                        <Stethoscope className="h-6 w-6 text-parchment/80" />
                    </span>
                    <span className="text-2xl font-medium">CodeStroke Pro</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center space-x-6 md:flex">
                    {[
                        { href: "/", label: "Home" },
                        { href: "/calculator", label: "Calculator" },
                        { href: "/about", label: "About" },
                        { href: "/resources", label: "Resources" },
                    ].map(({ href, label }) => (
                        <Link
                            key={label}
                            href={href}
                            className="text-base transition-colors text-parchment/80 hover:text-parchment"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden inline-flex items-center justify-center rounded-md p-2 transition hover:bg-white/10 hover:text-parchment focus:outline-none focus:ring-2 focus:ring-parchment/50"
                    aria-label="Toggle navigation"
                >
                    {open ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile nav (animated) */}
            <motion.nav
                initial={false}
                animate={open ? "open" : "closed"}
                variants={{
                    open: { height: "auto", opacity: 1 },
                    closed: { height: 0, opacity: 0 },
                }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="overflow-hidden bg-clinical-slate md:hidden"
            >
                <div className="space-y-2 px-4 pb-4">
                    {[
                        { href: "/", label: "Home" },
                        { href: "/calculator", label: "Calculator" },
                        { href: "/about", label: "About" },
                        { href: "/resources", label: "Resources" },
                    ].map(({ href, label }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-base transition text-parchment/80 hover:text-parchment"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </motion.nav>
        </header>
    );
}
