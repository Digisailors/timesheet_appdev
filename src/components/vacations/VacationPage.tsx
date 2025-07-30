"use client"

import { useState } from "react"
// import { Bell } from "lucide-react"
import { Search, Check, Clock, X, Heart, Filter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CreateVacationForm from "@/components/vacations/CreateVacations"

interface VacationEntry {
  id: number
  name: string
  leaveType: string
  duration: string
  role: string
  location: string
  startDate: string
  endDate: string
  status: "Paid" | "Unpaid"
}

const vacationData: VacationEntry[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    leaveType: "Annual Leave",
    duration: "6 days",
    role: "Rental",
    location: "Highway Bridge",
    startDate: "2024-06-15",
    endDate: "2024-06-22",
    status: "Paid",
  },
  {
    id: 2,
    name: "Michael Chen",
    leaveType: "Sick Leave",
    duration: "3 days",
    role: "Operations",
    location: "Downtown Office",
    startDate: "2024-06-18",
    endDate: "2024-06-20",
    status: "Paid",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    leaveType: "Personal Leave",
    duration: "2 days",
    role: "Customer Service",
    location: "Remote",
    startDate: "2024-06-19",
    endDate: "2024-06-20",
    status: "Unpaid",
  },
  {
    id: 4,
    name: "David Thompson",
    leaveType: "Annual Leave",
    duration: "10 days",
    role: "Engineering",
    location: "Tech Hub",
    startDate: "2024-06-25",
    endDate: "2024-07-05",
    status: "Paid",
  },
  {
    id: 5,
    name: "Lisa Wang",
    leaveType: "Maternity Leave",
    duration: "90 days",
    role: "Marketing",
    location: "Main Office",
    startDate: "2024-06-01",
    endDate: "2024-08-30",
    status: "Paid",
  },
]

const summaryData = [
  { title: "Approved", count: 2, icon: Check, borderColor: "#22c55e", iconColor: "#22c55e" },
  { title: "Pending", count: 1, icon: Clock, borderColor: "#f59e0b", iconColor: "#f59e0b" },
  { title: "Rejected", count: 1, icon: X, borderColor: "#ef4444", iconColor: "#ef4444" },
  { title: "On Leave", count: 1, icon: Heart, borderColor: "#3b82f6", iconColor: "#3b82f6" },
]

export default function VacationManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
 const [showCreateForm, setShowCreateForm] = useState(false);
 
 const filteredData = vacationData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && employee.status === "Paid") ||
      (statusFilter === "unpaid" && employee.status === "Unpaid")
    const matchesType = typeFilter === "all" || employee.leaveType.toLowerCase().includes(typeFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesType
  })

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setTypeFilter("all")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // const formatDateRange = (startDate: string, endDate: string) => {
  //   return `${startDate} to ${endDate}`
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-0">
      <div className="max-w-9xl mx-auto space-y-6 p-6">
         {/* Vacation Mode Heading - Made more prominent */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vacation Mode</h2>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow-none"
              onClick={() => setShowCreateForm(true)}
          >
            <span className="text-xl font-bold">+</span>
            <span>Create Vacation</span>
          </Button>
        </div>

 {/* Show CreateVacationForm as a modal/dialog with blur background */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setShowCreateForm(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <CreateVacationForm />
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryData.map((item) => (
            <Card key={item.title} className="relative overflow-hidden bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 flex-shrink-0">
                    <item.icon className="h-8 w-8" style={{color: item.iconColor}} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{item.count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter Bar */}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Search input */}
              <div className="relative max-w-[280px] w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 text-sm border border-gray-300"
                />
              </div>

              {/* Status filter */}
              <div className="min-w-[280px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 border-gray-300">
                    {statusFilter === "all" ? (
                      <span className="text-black">All Status</span>
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            {/* Type filter */}
              <div className="min-w-[280px]">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 border-gray-300">
                    {typeFilter === "all" ? (
                      <span className="text-black">All Types</span>
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal Leave</SelectItem>
                    <SelectItem value="maternity">Maternity Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-10 px-6 bg-white border border-gray-600 text-gray-900 hover:bg-gray-50 hover:border-gray-700 font-medium w-[220px]"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Employees on Vacation Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Employees on Vacation ({filteredData.length})</h2>

          <div className="space-y-4">
            {filteredData.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${getInitials(employee.name)}`} />
                        <AvatarFallback className="bg-blue-800 text-white">{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-600">
                          {employee.leaveType} • {employee.duration}
                        </p>
                        <p className="text-sm font-bold text-gray-500 border border-gray-300 rounded-full px-3 py-1 inline-block">
                           {employee.location}
                        </p>
                        <p className="text-sm font-bold text-gray-500 border border-gray-300 rounded-full px-3 py-1 inline-block ml-2">
                           {employee.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex flex-row items-start gap-4">
                          <div className="text-sm text-gray-600 flex flex-col">
                            <span className="font-bold">{employee.startDate}</span>
                            <span>to: {employee.endDate}</span>
                          </div>
                          <Badge
                            variant={employee.status === "Paid" ? "default" : "destructive"}
                            className={employee.status === "Paid" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                          >
                            {employee.status} Vacation
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border border-gray-800 text-black hover:bg-gray-100"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredData.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">No employees found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}