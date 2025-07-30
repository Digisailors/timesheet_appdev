"use client"

import { useState } from "react"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CreateVacationFormProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateVacationForm({ open = true, onOpenChange }: CreateVacationFormProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [employee, setEmployee] = useState("")
  const [leaveType, setLeaveType] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({
      employee,
      leaveType,
      startDate,
      endDate,
      reason,
    })
  }

  const handleCancel = () => {
    // Reset form or close dialog
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white text-black">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold mt-3">Create Vacation</DialogTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onOpenChange?.(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          {/* First Row - Employee and Leave Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee" className="text-sm font-bold">
                Employee
              </Label>
              <Select value={employee} onValueChange={setEmployee}>
                <SelectTrigger className="bg-white text-black border border-gray-400">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leave-type" className="text-sm font-bold">
                Leave Type
              </Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="bg-white text-black border border-gray-400">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black" >
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="maternity">Maternity Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row - Start Date and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white text-black!border !border-gray-400",
                      !startDate && "text-black"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white text-black !border !border-gray-400",
                      !endDate && "text-black"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Third Row - Eligible Days and Remaining Days */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold">Eligible Days</Label>
              <Input value="40 days" readOnly className="bg-muted border border-gray-400" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold">Remaining Days</Label>
              <Input placeholder="" className="bg-muted border border-gray-400" readOnly />
            </div>
          </div>

          {/* Reason for Leave */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-bold">
              Reason for Leave
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide details about your leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] resize-none bg-white text-black border-gray-400 placeholder:text-blue-600"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50/50">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
