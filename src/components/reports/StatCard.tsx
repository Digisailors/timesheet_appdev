"use client";

import React from "react";

import React, {} from "react";
import "react-datepicker/dist/react-datepicker.css";


// Types
interface StatCardProps {
  title: string;
  value: string;
  bgColor: string;
  textColor?: string;
}

// StatCard Component
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  bgColor,
  textColor = "text-gray-900",
}) => {
  return (
    <div className={`${bgColor} dark:bg-gray-800 p-4 rounded-lg shadow-sm`}>
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${textColor} dark:text-white`}>{value}</div>
    </div>
  );
};

export default StatCard;
