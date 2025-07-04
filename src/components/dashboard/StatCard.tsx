// src/components/dashboard/StatCard.tsx
"use client";

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
    red: 'text-red-500'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
      {/* Icon positioned in top right */}
      <div className="absolute top-6 right-6">
        <Icon className={`h-6 w-6 ${colorClasses[color]}`} />
      </div>
      
      {/* Content */}
      <div className="pr-8">
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;