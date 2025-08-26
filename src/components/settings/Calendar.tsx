/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';

interface Holiday {
  id: string;
  date: string;
  type: string;
  description?: string;
  createdAt?: string;
}

const SystemSettings: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [holidayType, setHolidayType] = useState('');
  const [description, setDescription] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [selectedFridays, setSelectedFridays] = useState<string[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const holidayTypes = [
    { value: 'weekly', label: 'Weekly Holiday' },
    { value: 'government', label: 'Government Holiday' }
  ];

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(`${API_BASE_URL}/holidays/all`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch holidays');
      }
      const result = await response.json();
      const holidaysArray = Array.isArray(result) ? result : result.data || [];
      setHolidays(holidaysArray);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error('Failed to load holidays');
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

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
      if (date.getDay() === 5) { // 5 is Friday
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        fridays.push(dateStr);
      }
    }
    return fridays;
  };

  const handleHolidayTypeChange = (type: string) => {
    setHolidayType(type);
    if (type === 'weekly') {
      const fridays = getFridaysInMonth(currentMonth, currentYear);
      setSelectedFridays(fridays);
    } else {
      setSelectedFridays([]);
    }
  };

  const renderMainCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"></div>
      );
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayHolidays = holidays.filter(h => h.date === dateStr);
      const isToday = new Date().toDateString() === new Date(dateStr).toDateString();
      const isFriday = new Date(dateStr).getDay() === 5;
      const isSelectedFriday = selectedFridays.includes(dateStr);

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
          } ${isSelectedFriday ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`}
          onClick={() => {
            setSelectedDate(dateStr);
            resetForm();
            setShowModal(true);
          }}
        >
          <span className={`text-sm font-medium ${
            isToday
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {day}
          </span>

          {/* Holiday indicators */}
          <div className="absolute inset-x-1 bottom-1 space-y-0.5">
            {dayHolidays.slice(0, 2).map((holiday) => (
              <div
                key={holiday.id}
                className={`text-xs px-1 py-0.5 rounded text-white text-center truncate ${
                  holiday.type === 'government' ? 'bg-blue-500' : 'bg-green-500'
                }`}
                title={`${holidayTypes.find(t => t.value === holiday.type)?.label}: ${holiday.description || 'No description'}`}
              >
                {holiday.type === 'government' ? 'Gov' : 'Weekly'}
              </div>
            ))}
            {dayHolidays.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{dayHolidays.length - 2} more
              </div>
            )}
          </div>
          {/* Edit/Delete buttons for holidays - show on hover */}
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

  const renderModalCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const hasHoliday = holidays.some(h => h.date === dateStr);
      const isFriday = new Date(dateStr).getDay() === 5;
      const isSelectedFriday = selectedFridays.includes(dateStr);

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateStr)}
          disabled={isSubmitting}
          className={`h-8 w-8 rounded hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center justify-center text-sm transition-colors disabled:opacity-50 ${
            isSelected
              ? 'bg-blue-600 text-white'
              : hasHoliday
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : isSelectedFriday
              ? 'bg-yellow-100 dark:bg-yellow-900'
              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'
          }`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const handleSaveHoliday = async () => {
    if (!selectedDate && selectedFridays.length === 0 && !holidayType) {
      toast.error('Please select a date and holiday type');
      return;
    }
    try {
      setIsSubmitting(true);
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      const datesToSave = holidayType === 'weekly' ? selectedFridays : [selectedDate];
      for (const date of datesToSave) {
        const payload = {
          date,
          type: holidayType,
          description: description.trim() || undefined
        };
        const url = isEditing
          ? `${API_BASE_URL}/holidays/update/${editingHolidayId}`
          : `${API_BASE_URL}/holidays/create`;
        const method = isEditing ? 'PUT' : 'POST';
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Failed to save holiday');
        }
      }
      toast.success(isEditing ? 'Holiday updated successfully!' : 'Holiday created successfully!', {
        style: { background: 'blue', color: 'white' }
      });
      await fetchHolidays();
      resetForm();
    } catch (error) {
      console.error('Error saving holiday:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save holiday');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setSelectedDate(holiday.date);
    setHolidayType(holiday.type);
    setDescription(holiday.description || '');
    setIsEditing(true);
    setEditingHolidayId(holiday.id);
    setShowModal(true);

    // Set calendar to show the month of the holiday
    const holidayDate = new Date(holiday.date);
    setCurrentMonth(holidayDate.getMonth());
    setCurrentYear(holidayDate.getFullYear());
  };

  const handleDeleteHoliday = async (holidayId: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(`${API_BASE_URL}/holidays/delete/${holidayId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete holiday');
      }
      toast.success('Holiday deleted successfully!', {
        style: { background: 'blue', color: 'white' }
      });
      await fetchHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete holiday');
    }
  };

  const resetForm = () => {
    setSelectedDate('');
    setHolidayType('');
    setDescription('');
    setIsEditing(false);
    setEditingHolidayId(null);
    setSelectedFridays([]);
    setShowModal(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading holidays...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Holiday Calendar</h3>
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
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {months[currentMonth]} {currentYear}
          </h2>

          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
              {day.slice(0, 3)}
            </div>
          ))}

          {/* Calendar Days */}
          {renderMainCalendar()}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Government Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Selected Fridays</span>
          </div>
        </div>
      </div>

      {/* Add/Edit Holiday Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Holiday' : 'Add Holiday'}
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
                    Selected Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'No date selected'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>
              {/* Calendar */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Select Date from Calendar
                </label>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => navigateMonth('prev')}
                      disabled={isSubmitting}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                    >
                      ←
                    </button>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {months[currentMonth]} {currentYear}
                    </h4>
                    <button
                      onClick={() => navigateMonth('next')}
                      disabled={isSubmitting}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {renderModalCalendar()}
                  </div>
                </div>
              </div>
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
                disabled={isSubmitting || (!selectedDate && selectedFridays.length === 0) || !holidayType}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Holiday' : 'Save Holiday')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
