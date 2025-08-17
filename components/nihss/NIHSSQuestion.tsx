"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface NIHSSQuestionOption {
    value: number | null;
    label: string;
    isSpecial?: boolean;
}

interface NIHSSQuestionProps {
    id: string;
    title: string;
    instructions: string;
    options: NIHSSQuestionOption[];
    value: number | null;
    onChange: (value: number | null) => void;
}

export default function NIHSSQuestion({
    id,
    title,
    instructions,
    options,
    value,
    onChange,
}: NIHSSQuestionProps) {
    return (
        <div className="mb-5 rounded-lg border border-gray-200 p-3 bg-white hover:shadow-sm transition-shadow">
            <div className="mb-3">
                <h4 className="text-base font-semibold text-deep-charcoal mb-1.5 flex items-center">
                    <span className="w-6 h-6 bg-clinical-slate text-white rounded-full mr-2 flex items-center justify-center text-xs">
                        {id}
                    </span>
                    {title}
                </h4>
                <p className="text-sm text-gray-500 mb-2 pl-8">
                    {instructions}
                </p>
            </div>

            <RadioGroup
                value={value !== null ? value.toString() : "null"}
                onValueChange={(val) => {
                    if (val === "null") {
                        onChange(null);
                    } else {
                        onChange(parseInt(val, 10));
                    }
                }}
            >
                <div className="space-y-1.5 pl-8">
                    {options.map((option) => {
                        // Determine score indicator color - using more muted tones
                        let scoreIndicatorColor = "";
                        if (!option.isSpecial) {
                            if (option.value === 0)
                                scoreIndicatorColor = "bg-green-400";
                            else if (option.value === 1)
                                scoreIndicatorColor = "bg-amber-400";
                            else if (option.value === 2)
                                scoreIndicatorColor = "bg-orange-400";
                            else if (option.value === 3)
                                scoreIndicatorColor = "bg-red-400";
                            else if (option.value === 4)
                                scoreIndicatorColor = "bg-red-500";
                            else if (option.value !== null)
                                scoreIndicatorColor = "bg-gray-500";
                        }

                        return (
                            <div
                                key={`${id}-${option.value}`}
                                className={`flex items-start p-2.5 rounded-md border transition-all
                  ${
                      value === option.value
                          ? option.isSpecial
                              ? "bg-gray-50 border-gray-300 shadow-sm"
                              : option.value === 0
                              ? "bg-green-50/50 border-green-100 shadow-sm"
                              : option.value === 1
                              ? "bg-amber-50/50 border-amber-100 shadow-sm"
                              : option.value === 2
                              ? "bg-orange-50/50 border-orange-100 shadow-sm"
                              : "bg-red-50/50 border-red-100 shadow-sm"
                          : "hover:bg-gray-50/70 border-gray-100"
                  }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem
                                        value={
                                            option.value !== null
                                                ? option.value.toString()
                                                : "null"
                                        }
                                        id={`${id}-${option.value}`}
                                        className="mt-0"
                                    />
                                    {!option.isSpecial &&
                                        option.value !== null && (
                                            <div
                                                className={`w-6 h-6 ${scoreIndicatorColor} rounded-full flex items-center justify-center text-xs text-white font-medium shadow-sm flex-shrink-0`}
                                            >
                                                {option.value}
                                            </div>
                                        )}
                                    {option.isSpecial && (
                                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-sm flex-shrink-0">
                                            UN
                                        </div>
                                    )}
                                    <Label
                                        htmlFor={`${id}-${option.value}`}
                                        className="text-sm leading-normal cursor-pointer flex-grow"
                                    >
                                        {option.label.includes(" - ") ? (
                                            <>
                                                <span className="text-gray-700">
                                                    {
                                                        option.label.split(
                                                            " - "
                                                        )[1]
                                                    }
                                                </span>
                                            </>
                                        ) : (
                                            option.label
                                        )}
                                    </Label>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </RadioGroup>
        </div>
    );
}
