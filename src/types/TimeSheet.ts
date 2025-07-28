export interface TimeCalculations {
  totalDutyHrs: number;
  ot: number;
}

export interface TimeSheet {
  remarks: string;
  supervisorName: string;
  timeCalculations: TimeCalculations;
  employee: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  otHours: number;
  travelTime: string;
  location: string;
  project: string;
  status: string;
  breakTime: string;
  timesheetDate: string;
  updatedAt: string;
}
