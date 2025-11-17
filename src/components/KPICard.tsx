import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, iconBgColor, iconColor = "white" }: KPICardProps) {
  return (
    <Card className="p-6 flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <div className={`${iconBgColor} rounded-lg w-9 h-9 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${iconColor}`} />
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-semibold">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}
