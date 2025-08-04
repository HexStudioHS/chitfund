import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

export default function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  bgColor,
  iconColor,
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-orange-600" : "text-gray-600";

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className={`text-sm flex items-center mt-1 ${trendColor}`}>
              <TrendIcon className="mr-1 h-4 w-4" />
              {change}
            </p>
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`${iconColor} text-xl`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
