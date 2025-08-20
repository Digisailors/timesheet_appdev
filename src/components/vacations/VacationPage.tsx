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

type IconType = LucideIcon;

interface VacationEntry {
  id: string;
  name: string;
  leaveType: string;
  duration: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "Paid" | "Unpaid";
  appliedDate: string;
  eligibleDays: string;
  remainingDays: string;
  reason: string;
  vacationFrom: string;
  vacationTo: string;
  project: string;
  specialization: string;
  returnstatus: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    status: string;
    eligibleDays: number;
    remainingDays: number;
    reason: string;
    returnstatus: string;
    employee?: {
      firstName: string;
      lastName: string;
      designation?: string;
      specialization: string;
    };
    supervisor?: {
      fullName: string;
      designation?: string;
      specialization: string;
    };
  }>;
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

  const fetchVacationData = async () => {
    try {
      const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vacations/all`);
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
          return {
            id: item.id,
            name,
            leaveType: item.leaveType,
            duration: `${calculateDuration(item.startDate, item.endDate)}`,
            role: item.employee ? item.employee.designation || "Unknown" : item.supervisor ? item.supervisor.designation || "Unknown" : "Unknown",
            location,
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.status.replace(" Vacation", "") as "Paid" | "Unpaid",
            appliedDate: new Date().toISOString().split('T')[0],
            eligibleDays: item.eligibleDays.toString(),
            remainingDays: item.remainingDays.toString(),
            reason: item.reason || "No reason provided",
            vacationFrom: item.startDate,
            vacationTo: item.endDate,
            project: item.employee ? item.employee.designation || "Unknown" : "Unknown",
            specialization: location,
            returnstatus: item.returnstatus,
          };
        });
        const uniqueStatuses = Array.from(new Set(response.data.data.map(item => item.returnstatus)));
        const uniqueTypes = Array.from(new Set(response.data.data.map(item => item.leaveType)));
        setStatusOptions(uniqueStatuses);
        setTypeOptions(uniqueTypes);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const thisMonthData = formattedData.filter((employee) => {
          const startDate = new Date(employee.startDate);
          const endDate = new Date(employee.endDate);
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
  }, []);

  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const filteredData = vacationData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      employee.returnstatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesType =
      typeFilter === "all" ||
      employee.leaveType.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

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
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 text-sm border border-gray-300 dark:bg-gray-800 text-white"
                />
              </div>

              {/* Status Filter (native select) */}
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

              {/* Type Filter (native select) */}
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

              {/* Clear Filters Button */}
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
            {filteredData.map((employee) => {
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
                              <span>to: {employee.endDate}</span>
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
                              {employee.returnstatus && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-blue-700 border-blue-500 text-white dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
                                >
                                  {employee.returnstatus === "Returned" ? "R" : "NR"}
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
          {filteredData.length === 0 && (
            <Card className="dark:bg-gray-800">
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-300">
                  No employees found matching your criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        {selectedVacation && (
          <ViewVacationDialog
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedVacation(null);
            }}
            data={selectedVacation}
            onReturn={fetchVacationData}
          />
        )}
        {selectedVacationForEdit && (
          <EditVacationDialog
            isOpen={showEditForm}
            onClose={() => {
              setShowEditForm(false);
              setSelectedVacationForEdit(null);
            }}
            onEditSuccess={fetchVacationData}
            data={selectedVacationForEdit}
          />
        )}
      </div>
    </div>
  );
}
