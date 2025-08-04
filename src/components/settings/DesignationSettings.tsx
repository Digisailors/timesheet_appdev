"use client";
import type React from "react";
import { useState, useEffect, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Users2 } from "lucide-react";

interface Designation {
  id?: string;
  name: string;
  status: string;
}

const DesignationSettings: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDesignationIndex, setCurrentDesignationIndex] = useState<number | null>(null);
  const [newDesignation, setNewDesignation] = useState<Designation>({
    name: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5088/api";

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/designationTypes/all`);
      if (!response.ok) {
        throw new Error(`Failed to fetch designations: ${response.statusText}`);
      }
      const data = await response.json();
      let designationsArray: Designation[] = [];
      if (Array.isArray(data)) {
        designationsArray = data;
      } else if (data && Array.isArray(data.data)) {
        designationsArray = data.data;
      } else if (data && Array.isArray(data.designations)) {
        designationsArray = data.designations;
      } else if (data && typeof data === "object") {
        const possibleArrays = Object.values(data).find((value) => Array.isArray(value));
        if (possibleArrays) {
          designationsArray = possibleArrays as Designation[];
        }
      }
      console.log("API Response:", data);
      console.log("Processed designations:", designationsArray);
      setDesignations(designationsArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch designations");
      console.error("Error fetching designations:", err);
      setDesignations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewDesignation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!newDesignation.name.trim()) {
      setError("Designation name is required");
      return;
    }
    if (!isEditing) {
      const existingDesignation = designations.find(
        (designation) => designation.name.toLowerCase() === newDesignation.name.toLowerCase().trim()
      );
      if (existingDesignation) {
        setError("Designation type already exists!");
        return;
      }
    }
    try {
      setSubmitting(true);
      setError(null);
      if (isEditing && currentDesignationIndex !== null) {
        const designationToUpdate = designations[currentDesignationIndex];
        const response = await fetch(`${API_BASE_URL}/designationTypes/update/${designationToUpdate.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: designationToUpdate.name,
            status: newDesignation.status,
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to update designation: ${response.statusText}`);
        }
        await fetchDesignations();
      } else {
        const response = await fetch(`${API_BASE_URL}/designationTypes/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newDesignation.name.trim(),
            status: newDesignation.status,
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to create designation: ${response.statusText}`);
        }
        await fetchDesignations();
      }
      setShowPopup(false);
      setIsEditing(false);
      setCurrentDesignationIndex(null);
      setNewDesignation({ name: "", status: "active" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save designation");
      console.error("Error saving designation:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (index: number) => {
    const designation = designations[index];
    setNewDesignation({
      name: designation.name,
      status: designation.status,
    });
    setCurrentDesignationIndex(index);
    setIsEditing(true);
    setShowPopup(true);
  };

  const handleDelete = (index: number) => {
    setCurrentDesignationIndex(index);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (currentDesignationIndex === null) return;
    try {
      setSubmitting(true);
      setError(null);
      const designationToDelete = designations[currentDesignationIndex];
      const response = await fetch(`${API_BASE_URL}/designationTypes/delete/${designationToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete designation: ${response.statusText}`);
      }
      await fetchDesignations();
      setShowDeleteConfirmation(false);
      setCurrentDesignationIndex(null);
      setToastMessage("Designation deleted successfully!");

      // Clear the toast message after 5 seconds
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete designation");
      console.error("Error deleting designation:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const Modal = ({ children, isOpen, withBlur = true }: { children: React.ReactNode; isOpen: boolean; withBlur?: boolean }) => {
    if (!isOpen) return null;
    return createPortal(
      <>
        <div
          className="fixed inset-0 z-40"
          style={withBlur ? { backdropFilter: "blur(4px)" } : { backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        ></div>
        <div className="fixed inset-0 flex items-center justify-center z-50">{children}</div>
      </>,
      document.body
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading designations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users2 className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-900 dark:text-white" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Employee Designations</h3>
        </div>
        <button
          onClick={() => {
            setShowPopup(true);
            setIsEditing(false);
            setNewDesignation({ name: "", status: "active" });
            setError(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition"
        >
          <PlusIcon className="h-4 w-4" />
          Add Designation
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      <div className="space-y-0">
        {!Array.isArray(designations) || designations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {!Array.isArray(designations)
              ? "Error loading designations. Please try again."
              : "No designations found. Add your first designation to get started."}
          </div>
        ) : (
          designations.map((designation, index) => (
            <div key={designation.id || index} className="flex items-center justify-between py-4 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
              <span className="text-gray-800 dark:text-gray-100 font-medium">{designation.name}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    designation.status.toLowerCase() === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {designation.status.charAt(0).toUpperCase() + designation.status.slice(1)}
                </span>
                <button
                  onClick={() => handleEdit(index)}
                  disabled={submitting}
                  className="p-1.5 text-gray-500 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 transition disabled:opacity-50"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  disabled={submitting}
                  className="p-1.5 text-gray-500 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 transition disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Add Modal */}
      <Modal isOpen={showPopup} withBlur={true}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{isEditing ? "Edit Designation" : "Add New Designation"}</h3>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="mb-4">
              <label htmlFor="designation-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Designation Type
              </label>
              <input
                id="designation-name"
                type="text"
                name="name"
                placeholder="Enter Designation"
                value={newDesignation.name}
                onChange={handleInputChange}
                disabled={submitting || isEditing}
                readOnly={isEditing}
                autoFocus={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 disabled:opacity-50 ${
                  isEditing
                    ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-white dark:bg-gray-700"
                }`}
              />
              {isEditing && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Designation name cannot be changed during edit</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="designation-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="designation-status"
                name="status"
                value={newDesignation.status}
                onChange={handleInputChange}
                disabled={submitting}
                autoFocus={isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPopup(false);
                  setIsEditing(false);
                  setCurrentDesignationIndex(null);
                  setNewDesignation({ name: "", status: "active" });
                  setError(null);
                }}
                disabled={submitting}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || (!isEditing && !newDesignation.name.trim())}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal - No Blur */}
      <Modal isOpen={showDeleteConfirmation} withBlur={false}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
          <p className="mb-4 text-gray-600 dark:text-gray-300">Are you sure you want to delete this designation? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDeleteConfirmation(false);
                setCurrentDesignationIndex(null);
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
      </Modal>

      {/* Toast Message */}
      {toastMessage && (
  <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
    {toastMessage}
  </div>
)}

    </div>
  );
};

export default DesignationSettings;
