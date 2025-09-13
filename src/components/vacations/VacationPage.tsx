/* eslint-disable */
"use client";
import { useState, useEffect } from "react";
import {
  Search,
  X,
  Heart,
  Filter,
  Plane,
  TreePalm,
  CreditCard,
  House,
  Baby,
  ChevronDown,
} from "lucide-react";
import { LucideIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CreateVacationForm from "@/components/vacations/CreateVacations";
import ViewVacationDialog from "./ViewVacationDialog";
import EditVacationDialog from "./EditVacationDialog";
import axios from "axios";
import { getSession } from "next-auth/react";
import EditVacationForm from "./EditVacationDialog";

type IconType = LucideIcon;

interface VacationEntry {
  id: string;
  name: string;
  leaveType: string;
  duration: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  status: "Paid" | "Unpaid";
  appliedDate: string;
  eligibleDays: string;
  remainingDays: string;
  reason: string | null;
  vacationFrom: string;
  vacationTo: string;
  project: string;
  specialization: string;
  returnstatus: string | null;
  return?: string | null;
  paidLeaveDays: string;
  unpaidLeaveDays: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    leaveType: string;
    startDate: string;
    endDate: string | null;
    reason: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    paidLeaveDays: string;
    unpaidLeaveDays: string;
    type: string;
    returnstatus?: string;
    return?: string;
    employee?: {
      id: string;
      firstName: string;
      lastName: string;
      designation: string;
      designationType: {
        designationTypeId: string;
        name: string;
      };
      phoneNumber: string;
      email: string;
      address: string;
      experience: string;
      dateOfJoining: string;
      specialization: string;
      createdAt: string;
      updatedAt: string;
      perHourRate: string;
      overtimeRate: string;
      eligibleLeaveDays: string;
      remainingLeaveDays: string;
      unpaidLeaveDays: string;
    };
    supervisor?: {
      id: string;
      fullName: string;
      designation?: string;
      specialization: string;
      phoneNumber: string;
      emailAddress: string;
      address: string;
      dateOfJoining: string;
      experience: string;
      createdAt: string;
      updatedAt: string;
      perHourRate: string;
      overtimeRate: string;
      eligibleLeaveDays: string;
      remainingLeaveDays: string;
      unpaidLeaveDays: string;
    };
  }>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SummaryData {
  title: string;
  count: number;
  icon: IconType;
  borderColor: string;
  iconColor: string;
}

export default function VacationManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState<VacationEntry | null>(null);
  const [selectedVacationForEdit, setSelectedVacationForEdit] = useState<VacationEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [vacationData, setVacationData] = useState<VacationEntry[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vacationsPerPage = 10;

  const fetchVacationData = async () => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/vacations/all`,
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          }
        }
      );
      if (response.data.success) {
        const formattedData = response.data.data.map((item) => {
          const name = item.employee
            ? `${item.employee.firstName} ${item.employee.lastName}`
            : item.supervisor
            ? item.supervisor.fullName
            : "Unknown";
          const location = item.employee
            ? item.employee.specialization
            : item.supervisor
            ? item.supervisor.specialization
            : "Unknown";
          const role = item.employee
            ? item.employee.designation || "Unknown"
            : item.supervisor
            ? item.supervisor.designation || "Unknown"
            : "Unknown";
          const status = item.status.replace(" Vacation", "") as "Paid" | "Unpaid";
          const endDate = item.endDate;
          const eligibleDays = parseInt(item.employee?.eligibleLeaveDays || item.supervisor?.eligibleLeaveDays || "0", 10);
          const remainingDays = parseInt(item.employee?.remainingLeaveDays || item.supervisor?.remainingLeaveDays || "0", 10);
          return {
            id: item.id,
            name,
            leaveType: item.leaveType,
            duration: `${calculateDuration(item.startDate, endDate || item.startDate)}`,
            role,
            location,
            startDate: item.startDate,
            endDate,
            status,
            appliedDate: new Date(item.createdAt).toISOString().split('T')[0],
            eligibleDays: eligibleDays.toString(),
            remainingDays: remainingDays.toString(),
            reason: item.reason,
            vacationFrom: item.startDate,
            vacationTo: endDate || item.startDate,
            project: role,
            specialization: location,
            returnstatus: item.returnstatus || null,
            return: item.return || null,
            paidLeaveDays: item.paidLeaveDays,
            unpaidLeaveDays: item.unpaidLeaveDays,
          };
        });
        const uniqueStatuses = Array.from(new Set(response.data.data.map(item => item.returnstatus || "Not Returned")));
        const uniqueTypes = Array.from(new Set(response.data.data.map(item => item.leaveType)));
        setStatusOptions(uniqueStatuses);
        setTypeOptions(uniqueTypes);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const thisMonthData = formattedData.filter((employee) => {
          const startDate = new Date(employee.startDate);
          const endDate = employee.endDate ? new Date(employee.endDate) : startDate;
          return (
            (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) ||
            (endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear)
          );
        });
        const uniqueEmployeesThisMonth = new Set<string>();
        thisMonthData.forEach((employee) => {
          uniqueEmployeesThisMonth.add(employee.name);
        });
        const paidVacationThisMonth = thisMonthData.filter(employee => employee.status === "Paid").length;
        const unpaidVacationThisMonth = thisMonthData.filter(employee => employee.status === "Unpaid").length;
        setSummaryData([
          {
            title: "Total Employees on vacation",
            count: uniqueEmployeesThisMonth.size,
            icon: TreePalm,
            borderColor: "#22c55e",
            iconColor: "#22c55e",
          },
          {
            title: "Paid Vacation",
            count: paidVacationThisMonth,
            icon: CreditCard,
            borderColor: "#f59e0b",
            iconColor: "#f59e0b",
          },
          {
            title: "Unpaid Vacation",
            count: unpaidVacationThisMonth,
            icon: X,
            borderColor: "#ef4444",
            iconColor: "#ef4444",
          },
        ]);
        setVacationData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching vacation data:", error);
    }
  };

  useEffect(() => {
    fetchVacationData();
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
  };

  const filteredData = vacationData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (employee.returnstatus && employee.returnstatus.toLowerCase() === statusFilter.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      employee.leaveType.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const indexOfLastVacation = currentPage * vacationsPerPage;
  const indexOfFirstVacation = indexOfLastVacation - vacationsPerPage;
  const paginatedVacations = filteredData.slice(indexOfFirstVacation, indexOfLastVacation);
  const totalPages = Math.ceil(filteredData.length / vacationsPerPage);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getLeaveTypeIcon = (leaveType: string): IconType => {
    switch (leaveType.toLowerCase()) {
      case "personal leave":
        return House;
      case "sick leave":
        return Heart;
      case "maternity leave":
        return Baby;
      case "annual leave":
        return Plane;
      default:
        return Plane;
    }
  };

  const handleVacationCreated = () => {
    fetchVacationData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 dark:bg-gray-900">
      <div className="max-w-9xl mx-auto space-y-6 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Plane className="text-blue-700" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
              Vacation Mode
            </h2>
          </div>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow-none"
            onClick={() => setShowCreateForm(true)}
          >
            <span className="text-xl font-bold">+</span>
            <span>Create Vacation</span>
          </Button>
        </div>
        {showCreateForm && (
          <CreateVacationForm
            open={showCreateForm}
            onOpenChange={setShowCreateForm}
            onSuccess={handleVacationCreated}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryData.map((item) => (
            <Card
              key={item.title}
              className="relative overflow-hidden bg-white shadow-sm dark:bg-gray-800 text-white"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 flex-shrink-0">
                    <item.icon
                      className="h-8 w-8"
                      style={{ color: item.iconColor }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-white">
                      {item.title}
                    </p>
                    <div className="flex items-center">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {item.count}
                      </p>
                      <p className="ml-2 text-black font-semibold dark:text-white">
                        This Month
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 text-sm border border-gray-300 dark:bg-gray-800 text-white"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm text-gray-700 dark:text-gray-100 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status.toLowerCase()}>
                      {status}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                </div>
              </div>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm text-gray-700 dark:text-gray-100 cursor-pointer"
                >
                  <option value="all">All Types</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type.toLowerCase()}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-10 px-6 bg-white border border-gray-600 text-gray-900 hover:bg-gray-50 hover:border-gray-700 font-medium dark:bg-gray-800 dark:text-white dark:border-white"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Employees on Vacation ({filteredData.length})
          </h2>
          <div className="space-y-4">
            {paginatedVacations.map((employee) => {
              const LeaveIcon = getLeaveTypeIcon(employee.leaveType);
              return (
                <Card
                  key={employee.id}
                  className="hover:shadow-md transition-shadow dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`/placeholder.svg?height=48&width=48&text=${getInitials(
                              employee.name
                            )}`}
                          />
                          <AvatarFallback className="bg-blue-800 text-white">
                            <LeaveIcon className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {employee.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {employee.leaveType} • {employee.duration}
                          </p>
                          <p className="text-sm font-bold text-gray-500 border border-gray-300 rounded-full px-3 py-1 inline-block dark:text-white dark:border-gray-600">
                            {employee.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex flex-row items-start gap-4">
                            <div className="text-sm text-gray-600 flex flex-col dark:text-gray-300">
                              <span className="font-bold">
                                {employee.startDate}
                              </span>
                              <span>to: {employee.endDate || "--/--/----"}</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <Badge
                                variant={employee.status === "Paid" ? "default" : "destructive"}
                                className={
                                  employee.status === "Paid"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                                    : "dark:bg-red-900 dark:text-red-200"
                                }
                              >
                                {employee.status} Vacation
                              </Badge>
                              {employee.return && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    employee.return === "Returned"
                                      ? "bg-green-100 text-green-800 border-green-500 dark:bg-green-900 dark:text-green-200 dark:border-green-600"
                                      : "bg-yellow-100 text-yellow-800 border-yellow-500 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-600"
                                  }`}
                                >
                                  {employee.return}
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-[100px] border border-gray-800 text-black hover:bg-gray-100 dark:text-white dark:hover:text-black dark:hover:bg-gray-50 dark:border-gray-600"
                                onClick={() => {
                                  setSelectedVacation(employee);
                                  setIsDialogOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-[100px] border border-gray-800 text-black hover:bg-gray-100 dark:text-white dark:hover:text-black dark:hover:bg-gray-50 dark:border-gray-600"
                                onClick={() => {
                                  setSelectedVacationForEdit(employee);
                                  setShowEditForm(true);
                                }}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {paginatedVacations.length === 0 ? (
            <Card className="dark:bg-gray-800">
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-300">
                  No employees found matching your criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex justify-end mt-6">
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border transition ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-black border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  &#8249;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-blue-500 text-white border-blue-500"
                        : "text-black border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border transition ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-black border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  &#8250;
                </button>
              </div>
            </div>
          )}
        </div>
        {selectedVacation && (
          <ViewVacationDialog
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedVacation(null);
            }}
            onReturn={fetchVacationData}
            data={{
              ...selectedVacation,
              reason: selectedVacation.reason || "",
              returnstatus: selectedVacation.returnstatus || "Not Return",
              return: selectedVacation.return || "Not Return",
              endDate: selectedVacation.endDate || "",
              paidLeaveDays: selectedVacation.paidLeaveDays || "0",
              unpaidLeaveDays: selectedVacation.unpaidLeaveDays || "0",
            }}
          />
        )}
        {selectedVacationForEdit && (
          <EditVacationForm
            open={showEditForm}
            onOpenChange={(open) => {
              setShowEditForm(open);
              if (!open) setSelectedVacationForEdit(null);
            }}
            onSuccess={() => {
              fetchVacationData();
              setShowEditForm(false);
              setSelectedVacationForEdit(null);
            }}
            initialData={{
              id: selectedVacationForEdit.id,
              name: selectedVacationForEdit.name,
              leaveType: selectedVacationForEdit.leaveType,
              startDate: selectedVacationForEdit.startDate,
              endDate: selectedVacationForEdit.endDate,
              reason: selectedVacationForEdit.reason || "",
              appliedDate: selectedVacationForEdit.appliedDate,
              vacationFrom: selectedVacationForEdit.vacationFrom,
              vacationTo: selectedVacationForEdit.vacationTo,
              duration: selectedVacationForEdit.duration,
              eligibleDays: selectedVacationForEdit.eligibleDays,
              remainingDays: selectedVacationForEdit.remainingDays,
              status: selectedVacationForEdit.status,
              project: selectedVacationForEdit.project,
              specialization: selectedVacationForEdit.specialization,
              returnstatus: selectedVacationForEdit.returnstatus,
            }}
          />
        )}
      </div>
    </div>
  );
}
