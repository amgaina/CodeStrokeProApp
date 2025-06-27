import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            colors: {
                // Clarity Protocol Color System
                parchment: "#F7F7F5",
                "deep-charcoal": "#2E3A40",
                "clinical-slate": "#3A506B",
                "harbor-gray": "#BCC5CE",
                "vital-green": "#2A9D8F",
                "urgent-amber": "#E9C46A",
                "critical-crimson": "#D62828",

                // Component mappings
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Clarity Protocol System
                clarity: {
                    background: "#F7F7F5",
                    foreground: "#2E3A40",
                    primary: "#3A506B",
                    muted: "#BCC5CE",
                    card: "#FFFFFF",
                    border: "#BCC5CE",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                clarity: "0 4px 12px rgba(46, 58, 64, 0.08)",
                "clarity-card": "0 2px 8px rgba(46, 58, 64, 0.06)",
                "clarity-card-hover": "0 4px 16px rgba(46, 58, 64, 0.12)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
