import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FeatureCard = ({
    icon,
    title,
    description,
    href,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    href?: string;
}) => {
    const CardComponent = (
        <Card
            className={`bg-white text-center border-harbor-gray clarity-shadow hover:shadow-lg transition-all duration-300 flex flex-col h-full ${
                href ? "group cursor-pointer hover:border-vital-green" : ""
            }`}
        >
            <CardHeader className="text-center items-center flex-shrink-0">
                <div className="w-14 h-14 bg-vital-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-vital-green/20 transition-colors">
                    {icon}
                </div>
                <CardTitle className="text-xl text-clinical-slate">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-clinical-slate/70">{description}</p>
            </CardContent>
            {href && (
                <CardFooter className="pt-0 pb-4 justify-center">
                    <div className="flex items-center text-sm font-medium text-vital-green opacity-0 group-hover:opacity-100 transition-opacity">
                        Launch tool
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                </CardFooter>
            )}
        </Card>
    );

    // If href is provided, wrap the card in a Link component
    if (href) {
        return (
            <Link href={href} className="block h-full">
                {CardComponent}
            </Link>
        );
    }

    // Otherwise, return the card as is
    return CardComponent;
};

export default FeatureCard;
