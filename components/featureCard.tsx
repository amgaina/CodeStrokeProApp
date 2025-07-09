import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCard = ({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) => (
    <Card className="bg-white text-center border-harbor-gray clarity-shadow hover:shadow-lg transition-all duration-300 flex flex-col">
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

export default FeatureCard;