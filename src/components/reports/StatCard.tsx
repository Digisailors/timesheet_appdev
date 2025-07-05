import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  bgColor = 'bg-blue-100', // Slightly deeper color for visibility
}) => {
  return (
    <div
      className={`rounded-2xl p-5 shadow-md w-full max-w-[220px] ${bgColor} transition-transform hover:scale-105`}
    >
      <div className="text-sm text-gray-700 mb-1 font-medium">{title}</div>
      <div className="text-xl text-gray-900 font-bold">{value}</div>
    </div>
  );
};

export default StatCard;
