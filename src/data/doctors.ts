import { Doctor } from "../types";

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "ডাঃ মোঃ আবু সাঈদ",
    specialty: "Medicine",
    degree: "MBBS, BCS (Health), FCPS (Medicine)",
    hospital: "ব্রাহ্মণবাড়িয়া জেনারেল হাসপাতাল",
    chamber: "ল্যাব এইড ডায়াগনস্টিক, ব্রাহ্মণবাড়িয়া",
    phone: "01711-XXXXXX",
    visitingHours: "বিকাল ৪টা - রাত ৮টা",
    bookingFee: 800
  },
  {
    id: "2",
    name: "ডাঃ ফৌজিয়া আক্তার",
    specialty: "Gynecology",
    degree: "MBBS, DGO, MCPS (Gynae)",
    hospital: "ব্রাহ্মণবাড়িয়া মেডিকেল কলেজ",
    chamber: "পপুলার ডায়াগনস্টিক সেন্টার, ব্রাহ্মণবাড়িয়া",
    phone: "01819-XXXXXX",
    visitingHours: "বিকাল ৩টা - সন্ধ্যা ৭টা",
    bookingFee: 700
  },
  {
    id: "3",
    name: "ডাঃ এস. এম. শাহিন",
    specialty: "Cardiology",
    degree: "MBBS, MD (Cardiology)",
    hospital: "জাতীয় হৃদরোগ ইনস্টিটিউট",
    chamber: "মেডিনোভা মেডিকেল সার্ভিসেস, ব্রাহ্মণবাড়িয়া",
    phone: "01911-XXXXXX",
    visitingHours: "শুক্রবার ও শনিবার",
    bookingFee: 1000
  },
  {
    id: "4",
    name: "ডাঃ মোঃ কামরুল হাসান",
    specialty: "Pediatrics",
    degree: "MBBS, DCH (Child)",
    hospital: "ব্রাহ্মণবাড়িয়া জেনারেল হাসপাতাল",
    chamber: "ব্রাহ্মণবাড়িয়া শিশু হাসপাতাল",
    phone: "01712-XXXXXX",
    visitingHours: "বিকাল ৫টা - রাত ৯টা",
    bookingFee: 600
  },
  {
    id: "5",
    name: "ডাঃ তানিয়া সুলতানা",
    specialty: "Dental",
    degree: "BDS, PGT (Dental)",
    hospital: "প্রাইভেট প্র্যাকটিস",
    chamber: "স্মাইল ডেন্টাল কেয়ার, টিএ রোড",
    phone: "01675-XXXXXX",
    visitingHours: "সকাল ১০টা - রাত ৮টা",
    bookingFee: 500
  }
];
