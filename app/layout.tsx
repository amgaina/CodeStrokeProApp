// app/layout.tsx  (or app/root-layout.tsx)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/home/header';
import Footer from '@/components/home/footer';
import './globals.css';
import DisclaimerGate from '@/components/disclaimerGate';
import DisclaimerBanner from '@/components/disclaimerBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: 'CodeStrokePro – Clinical Stroke Care Support',
    description:
        'Empowering rural healthcare providers, enhancing stroke care, and saving lives.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="min-h-screen flex flex-col">
                <DisclaimerGate>
                    <Header />
                    <DisclaimerBanner />
                    {/* main grows to fill, footer (if any) comes after */}
                    <main className="flex-1">{children}</main>
                    <Footer />
                </DisclaimerGate>
            </body>
        </html>
    );
}
