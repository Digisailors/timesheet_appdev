"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

// Types
interface StatCardProps {
  title: string;
  value: string;
  bgColor: string;
  textColor?: string;
}

interface TimesheetEntry {
  date: string;
  location: string;
  checkIn: string;
  checkOut: string;
  regularHours: number;
  otHours: number;
  travelTime: string;
  remarks: string;
}

// StatCard Component
const StatCard: React.FC<StatCardProps> = ({ title, value, bgColor, textColor = "text-gray-900" }) => {
  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-sm`}>
      <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    </div>
  );
};

export default StatCard;
