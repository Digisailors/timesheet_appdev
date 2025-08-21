"use client";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getSession } from "next-auth/react";

interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  designationType?: string | { designationTypeId: string; name: string };
  phoneNumber?: string;
  address?: string;
  experience?: string;
  dateOfJoining?: string;
  specialization?: string;
  project: string;
  workHours: string;
  workingHours?: string;
  normalHours?: string;
  otHours?: string;
  perHourRate?: string;
  overtimeRate?: string;
  timeFrame: string;
  avatar: string;
  avatarBg: string;
}

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  designation: string;
  designationType: string;
  phoneNumber: string;
  email: string;
  address: string;
  experience: string;
  dateOfJoining: string;
  specialization: string;
  workingHours: string;
  normalHours: string;
  otHours: string;
}

interface EmployeeAPIPayload {
  firstName: string;
  lastName: string;
  designation: string;
  designationTypeId: string;
  phoneNumber: string;
  email: string;
  address: string;
  experience: string;
  dateOfJoining: string;
  specialization: string;
  perHourRate: number;
  overtimeRate: number;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: EmployeeAPIPayload) => void;
  editingEmployee?: Employee | null;
  employees?: Employee[];
}

interface Rule {
  id: string;
  designation: {
    designationId: string;
    name: string;
    status: string;
  };
  breakTime: string;
  allowedTravelHours: string;
  normalHours: string;
  createdAt: string;
  updatedAt: string;
}

interface DesignationType {
  id: string;
  name: string;
  status: string;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingEmployee,
  employees = [],
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    designation: "",
    designationType: "",
    phoneNumber: "",
    email: "",
    address: "",
    experience: "",
    dateOfJoining: "",
    specialization: "",
    workingHours: "",
    normalHours: "",
    otHours: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [designationTypes, setDesignationTypes] = useState<DesignationType[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchDesignationTypes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingEmployee && designationTypes.length > 0) {
      const nameParts = editingEmployee.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      let workingHoursValue = editingEmployee.workingHours || "";
      if (workingHoursValue && !workingHoursValue.includes("hr")) {
        workingHoursValue = workingHoursValue + "hr";
      }
      let designationTypeId = "";
      if (typeof editingEmployee.designationType === "string") {
        const matchingType = designationTypes.find(
          (type) => type.name === editingEmployee.designationType
        );
        designationTypeId = matchingType ? matchingType.id : "";
      } else if (
        typeof editingEmployee.designationType === "object" &&
        editingEmployee.designationType
      ) {
        designationTypeId = editingEmployee.designationType.designationTypeId;
      }
      setFormData({
        firstName,
        lastName,
        designation: editingEmployee.designation || "",
        designationType: designationTypeId,
        phoneNumber: editingEmployee.phoneNumber || "+0000000000",
        email: editingEmployee.email || "",
        address: editingEmployee.address || "Some Address",
        experience: editingEmployee.experience || "0 years",
        dateOfJoining:
          editingEmployee.dateOfJoining ||
          new Date().toISOString().split("T")[0],
        specialization:
          editingEmployee.specialization || editingEmployee.project || "",
        workingHours: workingHoursValue,
        normalHours:
          editingEmployee.perHourRate || editingEmployee.normalHours || "",
        otHours: editingEmployee.overtimeRate || editingEmployee.otHours || "",
      });
    } else if (!editingEmployee && isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        designation: "",
        designationType: "",
        phoneNumber: "",
        email: "",
        address: "",
        experience: "",
        dateOfJoining: new Date().toISOString().split("T")[0],
        specialization: "",
        workingHours: "",
        normalHours: "",
        otHours: "",
      });
    }
    setErrors({});
    setTouched({});
  }, [editingEmployee, isOpen, designationTypes]);

  const fetchDesignationTypes = async () => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/rules/all`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const designationTypesMap = new Map<string, DesignationType>();
        data.data.forEach((rule: Rule) => {
          const designation = rule.designation;
          if (designation && designation.status === "active") {
            designationTypesMap.set(designation.designationId, {
              id: designation.designationId,
              name: designation.name,
              status: designation.status,
            });
          }
        });
        const uniqueDesignationTypes = Array.from(designationTypesMap.values());
        setDesignationTypes(uniqueDesignationTypes);
      } else {
        setDesignationTypes([]);
      }
    } catch (error) {
      console.error("Error fetching designation types from rules:", error);
      setDesignationTypes([]);
    }
  };

  const checkEmailExists = (email: string): boolean => {
    if (!email.trim()) return false;
    const emailsToCheck = editingEmployee
      ? employees.filter((emp) => emp.id !== editingEmployee.id)
      : employees;
    return emailsToCheck.some(
      (emp) => emp.email.toLowerCase() === email.toLowerCase()
    );
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        return !value.trim() ? "Please fill this field" : "";
      case "lastName":
        return !value.trim() ? "Please fill this field" : "";
      case "email":
        if (!value.trim()) return "Please fill this field";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        if (checkEmailExists(value)) return "This email already exists";
        return "";
      case "designation":
        return !value.trim() ? "Please fill this field" : "";
      case "designationType":
        return !value.trim() ? "Please fill this field" : "";
      case "phoneNumber":
        if (!value.trim()) return "Please fill this field";
        const phoneDigits = value.replace(/\D/g, "");
        if (phoneDigits.length !== 10) return "Please enter exactly 10 numbers";
        return "";
      case "address":
        return !value.trim() ? "Please fill this field" : "";
      case "experience":
        return !value.trim() ? "Please fill this field" : "";
      case "dateOfJoining":
        return !value.trim() ? "Please fill this field" : "";
      case "specialization":
        return !value.trim() ? "Please fill this field" : "";
      case "workingHours":
        return !value.trim() ? "Please fill this field" : "";
      case "normalHours":
        if (!value.trim()) return "Please fill this field";
        const normalHoursNum = parseFloat(value);
        if (isNaN(normalHoursNum) || normalHoursNum < 0)
          return "Please enter a valid number";
        return "";
      case "otHours":
        if (!value.trim()) return "Please fill this field";
        const otHoursNum = parseFloat(value);
        if (isNaN(otHoursNum) || otHoursNum < 0)
          return "Please enter a valid number";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      if (touched[name]) {
        const error = validateField(name, digitsOnly);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    } else if (name === "normalHours" || name === "otHours") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      const parts = numericValue.split(".");
      const formattedValue =
        parts.length > 2
          ? parts[0] + "." + parts.slice(1).join("")
          : numericValue;
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      if (touched[name]) {
        const error = validateField(name, formattedValue);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    } else if (name === "designationType") {
      let autoWorkingHours = "";
      const selectedType = designationTypes.find((type) => type.id === value);
      if (
        selectedType?.name === "Rental Employee" ||
        selectedType?.name === "Coaster Driver"
      ) {
        autoWorkingHours = "10hr";
      } else if (
        selectedType?.name === "Regular Employee" ||
        selectedType?.name === "Regular Driver"
      ) {
        autoWorkingHours = "8hr";
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        workingHours: autoWorkingHours,
      }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      if (errors["workingHours"] && autoWorkingHours) {
        setErrors((prev) => ({ ...prev, workingHours: "" }));
      }
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    const allFields = [
      "firstName",
      "lastName",
      "email",
      "designation",
      "designationType",
      "phoneNumber",
      "address",
      "experience",
      "dateOfJoining",
      "specialization",
      "normalHours",
      "otHours",
    ];
    allFields.forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof EmployeeFormData]
      );
      if (error) {
        newErrors[field] = error;
      }
    });
    const newTouched: { [key: string]: boolean } = {};
    allFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched((prev) => ({ ...prev, ...newTouched }));
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const apiPayload: EmployeeAPIPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      designation: formData.designation,
      designationTypeId: formData.designationType,
      phoneNumber: formData.phoneNumber,
      email: formData.email.trim().toLowerCase(),
      address: formData.address,
      experience: formData.experience,
      dateOfJoining: formData.dateOfJoining,
      specialization: formData.specialization,
      perHourRate: parseFloat(formData.normalHours),
      overtimeRate: parseFloat(formData.otHours),
    };
    try {
      onSubmit(apiPayload);
      onClose();
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const getFieldClassName = (fieldName: string, baseClassName: string) => {
    const hasError = errors[fieldName] && touched[fieldName];
    if (hasError) {
      return baseClassName
        .replace(
          "border-gray-300 dark:border-gray-600",
          "border-red-300 dark:border-red-500"
        )
        .replace(
          "focus:ring-blue-500 focus:border-blue-500",
          "focus:ring-red-500 focus:border-red-500"
        );
    }
    return baseClassName;
  };

  if (!isOpen) return null;
  const isEditing = !!editingEmployee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 md:mx-auto max-h-[95vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-4 sm:px-6 py-4 flex-1"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter First name"
                  className={getFieldClassName(
                    "firstName",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Last name"
                  className={getFieldClassName(
                    "lastName",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Email Address"
                  className={getFieldClassName(
                    "email",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="1234567890"
                  maxLength={10}
                  className={getFieldClassName(
                    "phoneNumber",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Designation (e.g., Software Engineer)"
                  className={getFieldClassName(
                    "designation",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.designation && touched.designation && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.designation}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Designation Type *
                </label>
                <select
                  name="designationType"
                  value={formData.designationType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClassName(
                    "designationType",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                >
                  <option value="">Select Designation Type</option>
                  {designationTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.designationType && touched.designationType && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.designationType}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Joining *
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                  className={getFieldClassName(
                    "dateOfJoining",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.dateOfJoining && touched.dateOfJoining && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.dateOfJoining}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., 5 years"
                  className={getFieldClassName(
                    "experience",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.experience && touched.experience && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.experience}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Per Hour Rate *
                </label>
                <input
                  type="text"
                  name="normalHours"
                  value={formData.normalHours}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter amount (e.g., 700)"
                  className={getFieldClassName(
                    "normalHours",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.normalHours && touched.normalHours && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.normalHours}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overtime Rate *
                </label>
                <input
                  type="text"
                  name="otHours"
                  value={formData.otHours}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter amount (e.g., 104)"
                  className={getFieldClassName(
                    "otHours",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.otHours && touched.otHours && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.otHours}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specialization/Skills *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Skills/Specialization (e.g., React, Node.js, Python)"
                  className={getFieldClassName(
                    "specialization",
                    "w-175 px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                  required
                />
                {errors.specialization && touched.specialization && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.specialization}
                  </p>
                )}
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter full address"
                  rows={3}
                  className={getFieldClassName(
                    "address",
                    "w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px]"
                  )}
                  required
                />
                {errors.address && touched.address && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              {isEditing ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
