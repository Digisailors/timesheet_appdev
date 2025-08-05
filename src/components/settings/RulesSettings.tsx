"use client";

import { useRef } from "react";
import type React from "react";
import { useState, useEffect, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { Edit, Trash2, Calculator, X, ChevronDown } from "lucide-react";

// Custom Modal Component
const CustomModal = ({
  children,
  isOpen,
  onClose,
  title,
  showCloseButton = true,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
}) => {
  if (!isOpen) return null;
  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="sm:max-w-[700px] w-full rounded-md p-0 bg-white text-black dark:bg-gray-800 dark:text-white shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="px-6 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300 h-6 w-6"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

// Custom Select Component
interface CustomSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}

const CustomSelect = ({
  id,
  value,
  onValueChange,
  placeholder,
  options,
  className,
  disabled,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (itemValue: string) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-blue-500 ${
          disabled ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""
        }`}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-50 ${
                option.value === value ? "font-semibold" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Interfaces
interface Designation {
  id: string;
  name: string;
}

interface Rule {
  id: string;
  designation: Designation;
  breakTime: number;
  allowedTravelHours: number;
  normalHours: number;
}

interface RuleFormState {
  designationId: string;
  breakTime: string;
  allowedTravelHours: string;
  normalHours: string;
}

interface DesignationOption {
  value: string;
  label: string;
}

const RulesSettings: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [designationOptions, setDesignationOptions] = useState<
    DesignationOption[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRuleId, setCurrentRuleId] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<RuleFormState>({
    designationId: "",
    breakTime: "",
    allowedTravelHours: "",
    normalHours: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5088/api";

  const fetchRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/rules/all`);
      if (!response.ok) {
        throw new Error(`Failed to fetch rules: ${response.statusText}`);
      }
      const data = await response.json();
      const rulesArray: Rule[] = Array.isArray(data) ? data : data.data || [];
      setRules(rulesArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rules");
      console.error("Error fetching rules:", err);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignationTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/designationTypes/all`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch designation types: ${response.statusText}`
        );
      }
      const data = await response.json();
      const designationsArray: Designation[] = Array.isArray(data)
        ? data
        : data.data || [];
      const options = designationsArray.map((d: Designation) => ({
        value: d.id,
        label: d.name,
      }));
      setDesignationOptions(options);
    } catch (err) {
      console.error("Error fetching designation types:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load designation types for dropdown."
      );
    }
  };

  useEffect(() => {
    fetchRules();
    fetchDesignationTypes();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Regex to allow only numbers and a single decimal point
    const numericRegex = /^-?\d*\.?\d*$/;

    if (
      name === "breakTime" ||
      name === "allowedTravelHours" ||
      name === "normalHours"
    ) {
      if (value === "" || numericRegex.test(value)) {
        setNewRule((prev) => ({
          ...prev,
          [name]: value,
        }));
        // Clear error for this field if it becomes valid
        if (error && numericRegex.test(value)) {
          setError(null);
        }
      } else {
        // Set a specific error if input is invalid
        setError(`Invalid character for ${name}. Please enter a valid number.`);
      }
    } else {
      setNewRule((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: keyof RuleFormState, value: string) => {
    setNewRule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Validate required fields based on whether it's an edit or new creation
    let validationError = false;
    if (!isEditing && !newRule.designationId) {
      setError("Designation Type is required.");
      validationError = true;
    }
    if (
      newRule.breakTime === "" ||
      newRule.allowedTravelHours === "" ||
      newRule.normalHours === ""
    ) {
      setError(
        "All numeric fields (Normal Hours, Break Time, Allowed Travel Hours) are required."
      );
      validationError = true;
    }

    if (validationError) {
      return;
    }

    // Validate numeric fields
    const numericFields = [
      "breakTime",
      "allowedTravelHours",
      "normalHours",
    ] as const;
    for (const field of numericFields) {
      if (isNaN(Number.parseFloat(newRule[field]))) {
        setError(
          `Invalid number for ${field}. Please enter a valid numeric value.`
        );
        return;
      }
    }

    if (!isEditing) {
      const existingRule = rules.find(
        (rule) => rule.designation.id === newRule.designationId
      );
      if (existingRule) {
        setError("A rule for this designation type already exists!");
        return;
      }
    }

    try {
      setSubmitting(true);
      setError(null); // Clear any previous errors before submission

      let payload: {
        breakTime: number;
        allowedTravelHours: number;
        normalHours: number;
        designationId?: string; // designationId is optional for update
      };

      let response: Response;

      if (isEditing && currentRuleId) {
        // For update, exclude designationId from the payload body
        payload = {
          breakTime: Number.parseFloat(newRule.breakTime),
          allowedTravelHours: Number.parseFloat(newRule.allowedTravelHours),
          normalHours: Number.parseFloat(newRule.normalHours),
        };
        console.log("Payload being sent for update:", payload); // Log the payload for debugging

        response = await fetch(
          `${API_BASE_URL}/rules/update/${currentRuleId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // For creation, include designationId in the payload body
        payload = {
          designationId: newRule.designationId,
          breakTime: Number.parseFloat(newRule.breakTime),
          allowedTravelHours: Number.parseFloat(newRule.allowedTravelHours),
          normalHours: Number.parseFloat(newRule.normalHours),
        };
        console.log("Payload being sent for creation:", payload); // Log the payload for debugging

        response = await fetch(`${API_BASE_URL}/rules/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to save rule: ${response.statusText}`
        );
      }

      await fetchRules();
      setShowPopup(false);
      setIsEditing(false);
      setCurrentRuleId(null);
      setNewRule({
        designationId: "",
        breakTime: "",
        allowedTravelHours: "",
        normalHours: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save rule");
      console.error("Error saving rule:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rule: Rule) => {
    // Safely convert numbers to strings, treating null/undefined as empty strings
    setNewRule({
      designationId: rule.designation.id,
      breakTime: rule.breakTime != null ? rule.breakTime.toString() : "",
      allowedTravelHours:
        rule.allowedTravelHours != null
          ? rule.allowedTravelHours.toString()
          : "",
      normalHours: rule.normalHours != null ? rule.normalHours.toString() : "",
    });
    setCurrentRuleId(rule.id);
    setIsEditing(true);
    setShowPopup(true);
    setError(null); // Clear any existing errors when opening the edit popup
    console.log("New rule state after handleEdit:", {
      designationId: rule.designation.id,
      breakTime: rule.breakTime != null ? rule.breakTime.toString() : "",
      allowedTravelHours:
        rule.allowedTravelHours != null
          ? rule.allowedTravelHours.toString()
          : "",
      normalHours: rule.normalHours != null ? rule.normalHours.toString() : "",
    });
  };

  const handleDelete = (ruleId: string) => {
    setCurrentRuleId(ruleId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!currentRuleId) return;
    try {
      setSubmitting(true);
      setError(null);
      const response = await fetch(
        `${API_BASE_URL}/rules/delete/${currentRuleId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to delete rule: ${response.statusText}`
        );
      }
      await fetchRules();
      setShowDeleteConfirmation(false);
      setCurrentRuleId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete rule");
      console.error("Error deleting rule:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full max-w-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading rules...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calculator className="h-6 w-6 text-gray-700 dark:text-white" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Designation-wise Timing Rules
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Configure working hours, overtime rates, and travel policies for
              each designation
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowPopup(true);
            setIsEditing(false);
            setNewRule({
              designationId: "",
              breakTime: "",
              allowedTravelHours: "",
              normalHours: "",
            });
            setError(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-2"
        >
          + Add Rule
        </button>
      </div>
      {error && !showPopup && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      <div className="space-y-4">
        {!Array.isArray(rules) || rules.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {!Array.isArray(rules)
              ? "Error loading rules. Please try again."
              : "No rules found. Add your first rule to get started."}
          </div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 items-start"
            >
              <div className="col-span-2">
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {rule.designation.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Standard: {rule.normalHours}h | Break: {rule.breakTime}h |
                  Travel: {rule.allowedTravelHours}h
                </p>
              </div>
              <div className="flex justify-end items-start space-x-2">
                <button
                  onClick={() => handleEdit(rule)}
                  disabled={submitting}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Edit className="h-4 w-4 text-gray-700 dark:text-white" />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  disabled={submitting}
                  className="p-2 border border-red-200 dark:border-red-500 rounded hover:bg-red-100 dark:hover:bg-red-600/20 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CustomModal
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false);
          setError(null);
        }}
        title={isEditing ? "Edit Rule" : "Add New Rule"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="px-6 pt-6 pb-0 space-y-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <label
                htmlFor="designation-select"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Designation Type
              </label>
              <CustomSelect
                id="designation-select"
                value={newRule.designationId}
                onValueChange={(value) =>
                  handleSelectChange("designationId", value)
                }
                placeholder="Select Designation"
                options={designationOptions}
                disabled={isEditing || submitting}
              />
              {isEditing && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Designation type cannot be changed during edit.
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="normal-hours"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Normal Hours (h)
                </label>
                <input
                  id="normal-hours"
                  type="text"
                  name="normalHours"
                  value={newRule.normalHours}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm h-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="break-time"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Break Time (h)
                </label>
                <input
                  id="break-time"
                  type="text"
                  name="breakTime"
                  value={newRule.breakTime}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm h-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="allowed-travel-hours"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Allowed Travel Hours (h)
              </label>
              <input
                id="allowed-travel-hours"
                type="text"
                name="allowedTravelHours"
                value={newRule.allowedTravelHours}
                onChange={handleInputChange}
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm h-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-4 px-6 py-4 border-t border-gray-200 bg-gray-100 dark:bg-gray-900 dark:border-gray-700 mt-6">
            <button
              type="button"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => {
                setShowPopup(false);
                setError(null);
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 py-2 gap-2"
              disabled={submitting || !!error}
            >
              {submitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </CustomModal>

      <CustomModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Confirm Deletion"
        showCloseButton={false}
      >
        <div className="p-6">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this rule? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDeleteConfirmation(false);
                setCurrentRuleId(null);
              }}
              disabled={submitting}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default RulesSettings;
