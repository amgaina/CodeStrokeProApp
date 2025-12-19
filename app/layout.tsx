// app/layout.tsx  (or app/root-layout.tsx)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/home/header';
import Footer from '@/components/home/footer';
import './globals.css';
import DisclaimerGate from '@/components/disclaimerGate';


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "CodeStrokePro – Clinical Stroke Care Support",
    description:
        "Empowering rural healthcare providers, enhancing stroke care, and saving lives.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta
                    name="description"
                    content="Empowering rural healthcare providers, enhancing stroke care, and saving lives."
                />
                <meta
                    name="keywords"
                    content="stroke, healthcare, rural, clinical, support, tPA, CodeStrokePro"
                />
                <meta name="author" content="CodeStrokePro Team" />
                <meta name="theme-color" content="#ffffff" />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicon_io/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon_io/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon_io/favicon-16x16.png"
                />
                <link rel="manifest" href="/favicon_io/site.webmanifest" />
                <link rel="shortcut icon" href="/favicon_io/favicon.ico" />
                <title>CodeStrokePro – Clinical Stroke Care Support</title>
                {/* Open Graph / SEO tags */}
                <meta
                    property="og:title"
                    content="CodeStrokePro – Clinical Stroke Care Support"
                />
                <meta
                    property="og:description"
                    content="Empowering rural healthcare providers, enhancing stroke care, and saving lives."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://codestrokepro.com" />
                <meta property="og:image" content="/logo/logo-light.png" />
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="CodeStrokePro – Clinical Stroke Care Support"
                />
                <meta
                    name="twitter:description"
                    content="Empowering rural healthcare providers, enhancing stroke care, and saving lives."
                />
                <meta name="twitter:image" content="/logo/logo-light.png" />
            </head>
            <body className="min-h-screen flex flex-col">
                <DisclaimerGate>
                    <Header />
                    {/* main grows to fill, footer (if any) comes after */}
                    <main className="flex-1">{children}</main>
                    <Footer />
                </DisclaimerGate>
            </body>
        </html>
    );
}
