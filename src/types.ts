export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  hospital: string;
  chamber: string;
  phone: string;
  visitingHours: string;
  bookingFee: number;
}

export type Specialty = 
  | "Medicine" 
  | "Cardiology" 
  | "Gynecology" 
  | "Pediatrics" 
  | "Orthopedics" 
  | "ENT" 
  | "Dermatology" 
  | "Eye" 
  | "Surgery" 
  | "Dental";
