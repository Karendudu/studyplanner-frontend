import { type ReactNode } from "react";
import Card from "./Card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

function StatCard({
  title,
  value,
  icon,
  color,
}: StatCardProps) {
  return (
    <Card className="hover:scale-105 transition-all duration-300 cursor-pointer">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-4">
            {value}
          </h2>

        </div>

        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white stat-icon"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}33 100%)`,
            boxShadow: `0 8px 20px ${color}22`,
          }}
        >
          {icon}
        </div>

      </div>

    </Card>
  );
}

export default StatCard;