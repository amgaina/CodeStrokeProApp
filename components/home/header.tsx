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

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Stethoscope, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// NavDropdown component for desktop
function NavDropdown({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-base text-parchment/80 hover:text-parchment"
            >
                {label}
                <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-clinical-slate/10"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b border-harbor-gray bg-clinical-slate py-1 text-parchment clarity-shadow">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand */}
                <Link href="/" className="flex items-center space-x-3">
                    {/* Logo: switches based on theme */}
                    <span className="rounded-ful">
                        <img
                            src="/logo/logo-light.png"
                            alt="CodeStroke Pro Logo"
                            className="h-14 w-14 block dark:hidden"
                        />
                        <img
                            src="/logo/logo-dark.png"
                            alt="CodeStroke Pro Logo Dark"
                            className="h-14 w-14 hidden dark:block"
                        />
                    </span>
                    <span className="text-2xl font-medium">CodeStroke Pro</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center space-x-6 md:flex">
                    <Link
                        href="/"
                        className="text-base transition-colors text-parchment/80 hover:text-parchment"
                    >
                        Home
                    </Link>

                    {/* Treatment Tools Group */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/calculator"
                            className="text-base transition-colors text-parchment/80 hover:text-parchment"
                        >
                            Calculator
                        </Link>
                        <Link
                            href="/fast-calc"
                            className="text-base transition-colors text-parchment/80 hover:text-parchment"
                        >
                            Quick Calc
                        </Link>
                    </div>

                    {/* Assessment Tools Dropdown */}
                    <NavDropdown label="Assessment Tools">
                        <Link
                            href="/nihss"
                            className="block px-4 py-2 text-sm text-clinical-slate hover:bg-gray-100"
                        >
                            NIHSS
                        </Link>
                        <Link
                            href="/cpss"
                            className="block px-4 py-2 text-sm text-clinical-slate hover:bg-gray-100"
                        >
                            CPSS
                        </Link>
                        <Link
                            href="/van"
                            className="block px-4 py-2 text-sm text-clinical-slate hover:bg-gray-100"
                        >
                            VAN
                        </Link>
                    </NavDropdown>

                    {/* Info Group */}
                    <Link
                        href="/resources"
                        className="text-base transition-colors text-parchment/80 hover:text-parchment"
                    >
                        Resources
                    </Link>
                    <Link
                        href="/about"
                        className="text-base transition-colors text-parchment/80 hover:text-parchment"
                    >
                        About
                    </Link>
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
                    {/* Home */}
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="block py-2 text-base transition text-parchment/80 hover:text-parchment"
                    >
                        Home
                    </Link>

                    {/* Treatment Tools Group */}
                    <div className="py-1 border-b border-harbor-gray/20">
                        <div className="py-1 text-sm text-parchment/60">
                            Treatment Tools
                        </div>
                        <Link
                            href="/calculator"
                            onClick={() => setOpen(false)}
                            className="block py-2 text-base transition text-parchment/80 hover:text-parchment"
                        >
                            Calculator
                        </Link>
                        <Link
                            href="/fast-calc"
                            onClick={() => setOpen(false)}
                            className="block py-2 text-base transition text-parchment/80 hover:text-parchment"
                        >
                            Quick Calc
                        </Link>
                    </div>

                    {/* Assessment Tools Group */}
                    <div className="py-1 border-b border-harbor-gray/20">
                        <div className="py-1 text-sm text-parchment/60">
                            Assessment Tools
                        </div>
                        <Link
                            href="/nihss"
                            onClick={() => setOpen(false)}
                            className="block py-2 text-base transition text-parchment/80 hover:text-parchment"
                        >
                            NIHSS
                        </Link>
                        <Link
                            href="/cpss"
                            onClick={() => setOpen(false)}
                            className="block py-2 text-base transition text-parchment/80 hover:text-parchment"
                        >
                            CPSS
                        </Link>
                        <Link
                            href="/van"
                            onClick={() => setOpen(false)}
                            className="block py-2 text-base transition text-parchment/80 hover:text-parchment"
                        >
                            VAN
                        </Link>
                    </div>

                    {/* Info Group */}
                    <Link
                        href="/resources"
                        onClick={() => setOpen(false)}
                        className="block py-2 text-base transition text-parchment/80 hover:text-parchment"
                    >
                        Resources
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setOpen(false)}
                        className="block py-2 text-base transition text-parchment/80 hover:text-parchment"
                    >
                        About
                    </Link>
                </div>
            </motion.nav>
        </header>
    );
}
