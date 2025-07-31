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
  const [internalOpen, setInternalOpen] = useState(open)

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [employee, setEmployee] = useState("")
  const [leaveType, setLeaveType] = useState("")
  const [reason, setReason] = useState("")

  const isDialogOpen = onOpenChange ? open : internalOpen

  const closeDialog = () => {
    onOpenChange?.(false)
    setInternalOpen(false)
  }

  const handleSubmit = () => {
    console.log({
      employee,
      leaveType,
      startDate,
      endDate,
      reason,
    })
    closeDialog()
  }

  const handleCancel = () => {
    closeDialog()
  }

  if (!isDialogOpen) return null

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange ?? setInternalOpen}>


      <DialogContent className="sm:max-w-[700px] rounded-md p-0 bg-white text-black">
        <DialogHeader className="px-6 pt-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Create Vacation</DialogTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={closeDialog}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pt-6 pb-0 space-y-6">
          {/* Employee and Leave Type */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Employee</Label>
              <Select value={employee} onValueChange={setEmployee}>
                <SelectTrigger className="bg-white border border-gray-300 text-sm h-10">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="bg-white border border-gray-300 text-sm h-10">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="maternity">Maternity Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Date and End Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm h-10 border border-gray-300 bg-white",
                      !startDate && "text-muted-foreground"
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
              <Label className="text-sm font-semibold">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm h-10 border border-gray-300 bg-white",
                      !endDate && "text-muted-foreground"
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

          {/* Eligible Days and Remaining Days */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Eligible Days</Label>
              <Input value="40 days" readOnly className="bg-white text-sm h-10 border border-gray-300" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Remaining Days</Label>
              <Input readOnly className="bg-white text-sm h-10 border border-gray-300" />
            </div>
          </div>

          {/* Reason for Leave */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Reason for Leave</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide details about your leave request..."
              className="min-h-[100px] resize-none text-sm border border-gray-300 placeholder:text-blue-600"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-4 px-6 py-4 border-t bg-gray-100">
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
