/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Calendar, Plus, X, Trash2, Edit, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";

interface Holiday {
  id: string;
  date: string;
  holidayType: string;
  weekday?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const SystemSettings: React.FC = () => {
  // State declarations
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [holidayType, setHolidayType] = useState("");
  const [description, setDescription] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [selectedFridays, setSelectedFridays] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5088/api";

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const holidayTypes = [
    { value: "Weekly Holiday", label: "Weekly Holiday" },
    { value: "Religious Holiday", label: "Religious Holiday" },
    { value: "Public Holiday", label: "Public Holiday" },
  ];

  // Helper function to get holiday color
  const getHolidayColor = (holidayType: string) => {
    switch (holidayType) {
      case "Weekly Holiday":
        return "bg-green-500";
      case "Religious Holiday":
        return "bg-purple-500";
      case "Public Holiday":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  // Helper function to get holiday badge text
  const getHolidayBadgeText = (holidayType: string) => {
    switch (holidayType) {
      case "Weekly Holiday":
        return "Weekly";
      case "Religious Holiday":
        return "Religious";
      case "Public Holiday":
        return "Public";
      default:
        return "Holiday";
    }
  };

  // Fetch holidays from API
  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(`${API_BASE_URL}/calendar/all`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }
      const result = await response.json();
      const holidaysArray = Array.isArray(result.data)
        ? result.data
        : result.data || [];
      setHolidays(holidaysArray);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast.error("Failed to load holidays");
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Helper functions for calendar rendering
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getFridaysInMonth = (month: number, year: number) => {
    const fridays: string[] = [];
    const daysInMonth = getDaysInMonth(month, year);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === 5) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        fridays.push(dateStr);
      }
    }
    return fridays;
  };

  // Handle holiday type change
  const handleHolidayTypeChange = (type: string) => {
    setHolidayType(type);
    if (type === "Weekly Holiday") {
      const fridays = getFridaysInMonth(currentMonth, currentYear);
      setSelectedFridays(fridays);
      setSelectedDate("");
    } else {
      setSelectedFridays([]);
    }
  };

  // Check if a date is clickable based on holiday type
  const isDateClickable = (dateStr: string) => {
    if (holidayType === "Weekly Holiday") {
      return new Date(dateStr).getDay() === 5;
    }
    return true;
  };

  // Render main calendar
  const renderMainCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        ></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const dayHolidays = holidays.filter((h) => h.date === dateStr);
      const isToday =
        new Date().toDateString() === new Date(dateStr).toDateString();
      const isFriday = new Date(dateStr).getDay() === 5;
      const isSelectedFriday = selectedFridays.includes(dateStr);

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            isToday ? "ring-2 ring-blue-500 ring-inset" : ""
          } ${isSelectedFriday ? "bg-yellow-100 dark:bg-yellow-900" : ""}`}
          onClick={() => {
            setSelectedDate(dateStr);
            resetForm();
            setShowModal(true);
          }}
        >
          <span
            className={`text-sm font-medium ${
              isToday
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {day}
          </span>
          <div className="absolute inset-x-1 bottom-1 space-y-0.5">
            {dayHolidays.slice(0, 2).map((holiday) => (
              <div
                key={holiday.id}
                className={`text-xs px-1 py-0.5 rounded text-white text-center truncate ${getHolidayColor(
                  holiday.holidayType
                )}`}
                title={`${
                  holidayTypes.find((t) => t.value === holiday.holidayType)
                    ?.label
                }: ${holiday.description || "No description"}`}
              >
                {getHolidayBadgeText(holiday.holidayType)}
              </div>
            ))}
            {dayHolidays.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{dayHolidays.length - 2} more
              </div>
            )}
          </div>
          {dayHolidays.length > 0 && (
            <div className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dayHolidays[0]) handleEditHoliday(dayHolidays[0]);
                  }}
                  className="p-1 bg-white dark:bg-gray-700 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-600"
                  title="Edit Holiday"
                >
                  <Edit className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dayHolidays[0]) handleDeleteHoliday(dayHolidays[0].id);
                  }}
                  className="p-1 bg-white dark:bg-gray-700 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-600"
                  title="Delete Holiday"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  // Render modal calendar
  const renderModalCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const isSelected = selectedDate === dateStr;
      const hasHoliday = holidays.some((h) => h.date === dateStr);
      const isFriday = new Date(dateStr).getDay() === 5;
      const isSelectedFriday = selectedFridays.includes(dateStr);
      const isClickable = isDateClickable(dateStr);

      days.push(
        <button
          key={day}
          onClick={() => isClickable && setSelectedDate(dateStr)}
          disabled={isSubmitting || !isClickable}
          className={`h-8 w-8 rounded flex items-center justify-center text-sm transition-colors ${
            !isClickable
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
              : isSelected
              ? "bg-blue-600 text-white"
              : hasHoliday
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
              : isSelectedFriday
              ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
              : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600"
          }`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  // Generate weekly holidays
  const generateWeeklyHolidays = async () => {
    try {
      setIsSubmitting(true);
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(
        `${API_BASE_URL}/calendar/generate-weekly-holidays/${currentYear}/${String(
          currentMonth + 1
        ).padStart(2, "0")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to generate weekly holidays");
      }
      toast.success("Weekly holidays generated successfully!", {
        style: { background: "green", color: "white" },
      });
      await fetchHolidays();
      resetForm();
    } catch (error) {
      console.error("Error generating weekly holidays:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate weekly holidays"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save holiday
  const proceedWithSave = async () => {
    try {
      setIsSubmitting(true);
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      if (holidayType === "Weekly Holiday") {
        await generateWeeklyHolidays();
      } else {
        const payload = {
          holidayType: holidayType,
          date: selectedDate,
          description: description.trim() || undefined,
        };
        const url = isEditing
          ? `${API_BASE_URL}/calendar/update/${editingHolidayId}`
          : `${API_BASE_URL}/calendar/create`;
        const method = isEditing ? "PUT" : "POST";
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("Failed to save holiday");
        }
        toast.success(
          isEditing
            ? "Holiday updated successfully!"
            : "Holiday created successfully!",
          {
            style: { background: "blue", color: "white" },
          }
        );
        await fetchHolidays();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving holiday:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save holiday"
      );
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  // Handle save holiday
  const handleSaveHoliday = async () => {
    if (holidayType === "Weekly Holiday") {
      await proceedWithSave();
      return;
    }
    if (!selectedDate || !holidayType) {
      toast.error("Please select a date and holiday type");
      return;
    }
    if (
      (holidayType === "Religious Holiday" ||
        holidayType === "Public Holiday") &&
      selectedDate
    ) {
      const selectedDateObj = new Date(selectedDate);
      const isFriday = selectedDateObj.getDay() === 5;
      if (isFriday) {
        setShowConfirmModal(true);
        return;
      }
    }
    await proceedWithSave();
  };

  // Handle edit holiday
  const handleEditHoliday = (holiday: Holiday) => {
    setSelectedDate(holiday.date);
    setHolidayType(holiday.holidayType);
    setDescription(holiday.description || "");
    setIsEditing(true);
    setEditingHolidayId(holiday.id);
    setShowModal(true);
    const holidayDate = new Date(holiday.date);
    setCurrentMonth(holidayDate.getMonth());
    setCurrentYear(holidayDate.getFullYear());
    if (holiday.holidayType === "Weekly Holiday") {
      const fridays = getFridaysInMonth(
        holidayDate.getMonth(),
        holidayDate.getFullYear()
      );
      setSelectedFridays(fridays);
    }
  };

  // Handle delete holiday
  const handleDeleteHoliday = async (holidayId: string) => {
    if (!confirm("Are you sure you want to delete this holiday?")) return;
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(
        `${API_BASE_URL}/calendar/delete/${holidayId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete holiday");
      }
      toast.success("Holiday deleted successfully!", {
        style: { background: "red", color: "white" },
      });
      await fetchHolidays();
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete holiday"
      );
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedDate("");
    setHolidayType("");
    setDescription("");
    setIsEditing(false);
    setEditingHolidayId(null);
    setSelectedFridays([]);
    setShowModal(false);
    setShowConfirmModal(false);
  };

  // Navigate month
  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        const newMonth = 11;
        const newYear = currentYear - 1;
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        if (holidayType === "Weekly Holiday") {
          const fridays = getFridaysInMonth(newMonth, newYear);
          setSelectedFridays(fridays);
        }
      } else {
        const newMonth = currentMonth - 1;
        setCurrentMonth(newMonth);
        if (holidayType === "Weekly Holiday") {
          const fridays = getFridaysInMonth(newMonth, currentYear);
          setSelectedFridays(fridays);
        }
      }
    } else {
      if (currentMonth === 11) {
        const newMonth = 0;
        const newYear = currentYear + 1;
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        if (holidayType === "Weekly Holiday") {
          const fridays = getFridaysInMonth(newMonth, newYear);
          setSelectedFridays(fridays);
        }
      } else {
        const newMonth = currentMonth + 1;
        setCurrentMonth(newMonth);
        if (holidayType === "Weekly Holiday") {
          const fridays = getFridaysInMonth(newMonth, currentYear);
          setSelectedFridays(fridays);
        }
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading holidays...
          </span>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Holiday Calendar
          </h3>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
        >
          <Plus className="w-4 h-4" />
          Add Holiday
        </button>
      </div>
      {/* Main Calendar Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {months[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600"
            >
              {day.slice(0, 3)}
            </div>
          ))}
          {/* Calendar Days */}
          {renderMainCalendar()}
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Weekly Holiday
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Religious Holiday
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Public Holiday
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Selected Fridays
            </span>
          </div>
        </div>
      </div>
      {/* Add/Edit Holiday Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? "Edit Holiday" : "Add Holiday"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Holiday Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Holiday Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={holidayType}
                    onChange={(e) => handleHolidayTypeChange(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  >
                    <option value="">Select Holiday Type</option>
                    {holidayTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Selected Date Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {holidayType === "Weekly Holiday"
                      ? "Current Month"
                      : "Selected Date"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={
                      holidayType === "Weekly Holiday"
                        ? `${months[currentMonth]} ${currentYear} (All Fridays)`
                        : selectedDate
                        ? new Date(
                            selectedDate + "T00:00:00"
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No date selected"
                    }
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>
              {/* Calendar - only show for non-weekly holidays */}
              {holidayType !== "Weekly Holiday" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Select Date from Calendar
                  </label>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => navigateMonth("prev")}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                      >
                        ←
                      </button>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {months[currentMonth]} {currentYear}
                      </h4>
                      <button
                        onClick={() => navigateMonth("next")}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                      >
                        →
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div
                          key={day}
                          className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {renderModalCalendar()}
                    </div>
                  </div>
                </div>
              )}
              {/* Weekly Holiday Info */}
              {holidayType === "Weekly Holiday" && (
                <div className="mt-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">
                      Weekly Holiday Generation
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      This will automatically generate weekly holidays for all
                      Fridays in {months[currentMonth]} {currentYear}.
                    </p>
                  </div>
                </div>
              )}
              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter holiday description or reason..."
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHoliday}
                disabled={
                  isSubmitting ||
                  (holidayType !== "Weekly Holiday" && !selectedDate) ||
                  !holidayType
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isSubmitting
                  ? holidayType === "Weekly Holiday"
                    ? "Generating..."
                    : "Saving..."
                  : isEditing
                  ? "Update Holiday"
                  : holidayType === "Weekly Holiday"
                  ? "Generate Weekly Holidays"
                  : "Save Holiday"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Friday Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Friday Holiday Confirmation
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    This requires your confirmation to proceed
                  </p>
                </div>
              </div>
              <div className="mb-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                    The selected day is <strong>Friday</strong>, which is
                    typically a <strong>Weekly Holiday</strong>. Are you sure
                    you want to change it into a <strong>{holidayType}</strong>?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Selected Date:{" "}
                    {selectedDate &&
                      new Date(selectedDate + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedWithSave}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition disabled:opacity-50 flex items-center gap-2 font-medium"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isSubmitting ? "Saving..." : "Yes, Proceed"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
