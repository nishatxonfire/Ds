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
  experience?: string;
  about?: string;
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
