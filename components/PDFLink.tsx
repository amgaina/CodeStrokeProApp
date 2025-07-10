"use client";

import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PDFLinkProps {
    filename: string;
    title: string;
    description?: string;
    size?: string;
    variant?: "link" | "button" | "card";
    showDownload?: boolean;
}

export function PDFLink({
    filename,
    title,
    description,
    size,
    variant = "link",
    showDownload = true,
}: PDFLinkProps) {
    const pdfUrl = `/pdfs/${filename}`;

    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = filename;
        link.click();
    };

    const handleView = () => {
        window.open(pdfUrl, "_blank", "noopener,noreferrer");
    };

    if (variant === "card") {
        return (
            <Card className="clarity-shadow border border-harbor-gray bg-white hover:bg-harbor-gray/5 transition-colors">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <FileText className="h-6 w-6 text-critical-crimson flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-medium text-deep-charcoal">
                                    {title}
                                </h3>
                                {description && (
                                    <p className="text-sm text-deep-charcoal/70 mt-1">
                                        {description}
                                    </p>
                                )}
                                {size && (
                                    <p className="text-xs text-deep-charcoal/50 mt-1">
                                        Size: {size}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleView}
                                className="text-clinical-slate hover:text-vital-green"
                            >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                            </Button>
                            {showDownload && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownload}
                                    className="text-clinical-slate hover:text-vital-green"
                                >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (variant === "button") {
        return (
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={handleView}
                    className="text-clinical-slate hover:text-vital-green"
                >
                    <FileText className="h-4 w-4 mr-2" />
                    {title}
                </Button>
                {showDownload && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDownload}
                        className="text-clinical-slate hover:text-vital-green"
                        title="Download PDF"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                )}
            </div>
        );
    }

    // Default link variant
    return (
        <div className="flex items-center gap-2">
            <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-clinical-slate hover:text-vital-green transition-colors"
            >
                <FileText className="h-5 w-5" />
                <span className="underline underline-offset-2">{title}</span>
                <ExternalLink className="h-4 w-4" />
            </a>
            {showDownload && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="text-clinical-slate hover:text-vital-green p-1 h-auto"
                    title="Download PDF"
                >
                    <Download className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}

export default PDFLink;
