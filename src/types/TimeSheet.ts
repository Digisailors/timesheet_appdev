export interface TimeCalculations {
  totalDutyHrs: number;
  ot: number;
}

export interface TimeSheet {
  id: string;
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
  perHourRate: string;
  overtimeRate: string;
  regularTimeSalary: string;
  overTimeSalary: string;
  type: string;
  isSupervisor: boolean;
  designationType: string;
  // Original time fields for editing
  onsiteTravelStart: string;
  onsiteTravelEnd: string;
  onsiteSignIn: string;
  onsiteBreakStart: string;
  onsiteBreakEnd: string;
  onsiteSignOut: string;
  offsiteTravelStart: string;
  offsiteTravelEnd: string;
}