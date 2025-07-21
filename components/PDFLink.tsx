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
            <div className="flex flex-col gap-2 w-full">
                <Button
                    variant="outline"
                    onClick={handleView}
                    className="text-clinical-slate hover:text-vital-green w-full min-h-[44px] px-3 py-2 text-sm font-medium h-max max-w-xs"
                >
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate overflow-hidden text-ellipsis text-left w-full">
                        {title}
                    </span>
                    <ExternalLink className="h-3 w-3 ml-2 flex-shrink-0" />
                </Button>
                {showDownload && (
                    <Button
                        variant="outline"
                        onClick={handleDownload}
                        className="text-clinical-slate hover:text-vital-green w-full min-h-[44px] px-3 py-2 text-sm font-medium"
                        title="Download PDF"
                    >
                        <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Download PDF</span>
                    </Button>
                )}
            </div>
        );
    }

    // Default link variant
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-clinical-slate hover:text-vital-green transition-colors min-h-[44px] p-2 rounded-md hover:bg-gray-50 flex-1"
            >
                <FileText className="h-5 w-5 flex-shrink-0" />
                <span className="underline underline-offset-2 font-medium text-sm">
                    {title}
                </span>
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
            </a>
            {showDownload && (
                <Button
                    variant="ghost"
                    onClick={handleDownload}
                    className="text-clinical-slate hover:text-vital-green min-h-[44px] px-4 py-2 w-full sm:w-auto"
                    title="Download PDF"
                >
                    <Download className="h-4 w-4 mr-2" />
                    <span>Download</span>
                </Button>
            )}
        </div>
    );
}

export default PDFLink;
