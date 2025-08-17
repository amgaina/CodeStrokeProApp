import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
        <Card className="bg-white text-center border-harbor-gray clarity-shadow hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <CardHeader className="text-center items-center flex-shrink-0">
                <div className="w-14 h-14 bg-vital-green/10 rounded-xl flex items-center justify-center mb-4">
                    {icon}
                </div>
                <CardTitle className="text-xl text-deep-charcoal">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-deep-charcoal/70">{description}</p>
            </CardContent>
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