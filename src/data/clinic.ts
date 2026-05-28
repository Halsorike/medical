// Mock data for the clinic / medical-practice side of the admin.
// Replace with real APIs later.

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  image?: string;
  status: "active" | "inactive";
};

export type Role = { id: string; name: string; members: number; permissions: number };

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  nextAppointment?: string;
  employee: string;
  registered: string;
};

export type Department = { id: string; name: string; services: number; employees: number; patients: number; head: string };

export type Service = {
  id: string;
  name: string;
  department: string;
  totalPatients: number;
  totalSales: number;
};

export type Appointment = {
  id: string;
  patientName: string;
  type: "Zoom" | "In-Person" | "Phone";
  details: string;
  date: string;
  time: string;
  employee: string;
  status: "upcoming" | "done" | "cancelled";
};

export type Schedule = {
  id: string;
  service: string;
  sessionType: string;
  period: string;
  date: string;
  time: string;
  employee: string;
};

export type Holiday = {
  id: string;
  employee: string;
  period: string;
  date: string;
  reason: string;
  type: "holiday" | "leave";
};

export type EvaluationDef = { id: string; name: string; submissions: number };
export type EvaluationSubmission = { id: string; evaluationName: string; email: string; score: number; result: string; date: string };

export type BlogCategory = { id: string; name: string; blogs: number };
export type Blog = { id: string; title: string; creator: string; category: string; status: "approved" | "pending" | "declined"; date: string };

export type MailMessage = { id: string; from: string; to: string; subject: string; body: string; date: string; read: boolean; folder: "inbox" | "sent" };
export type ContactRequest = { id: string; name: string; phone: string; email: string; message: string; date: string; status: "new" | "replied" };

export type IncomeRecord = { id: string; invoice: string; patient: string; date: string; description: string; employee: string; service: string; amount: number };
export type ExpenseRecord = { id: string; invoice: string; date: string; description: string; head: string; amount: number };

export type AppointmentStat = { label: string; value: number };

export const clinicStats: AppointmentStat[] = [
  { label: "All Appointments", value: 40 },
  { label: "Done Appointments", value: 30 },
  { label: "Cancelled Appointments", value: 4 },
  { label: "Upcoming Appointments", value: 10 },
];

export const departments: Department[] = [
  { id: "DEP-01", name: "Cardiology", services: 6, employees: 8, patients: 124, head: "Dr. Lina Cho" },
  { id: "DEP-02", name: "Pediatrics", services: 5, employees: 6, patients: 98, head: "Dr. Mark Iyer" },
  { id: "DEP-03", name: "Dermatology", services: 4, employees: 4, patients: 71, head: "Dr. Aisha Wahby" },
  { id: "DEP-04", name: "Orthopedics", services: 7, employees: 9, patients: 142, head: "Dr. Sam Patel" },
  { id: "DEP-05", name: "Audiology", services: 3, employees: 3, patients: 56, head: "Dr. Erin Park" },
  { id: "DEP-06", name: "Radiology", services: 5, employees: 5, patients: 89, head: "Dr. Hugo Pereira" },
  { id: "DEP-07", name: "Neurology", services: 6, employees: 7, patients: 110, head: "Dr. Maria Cohen" },
  { id: "DEP-08", name: "Internal Medicine", services: 8, employees: 12, patients: 188, head: "Dr. Owen Black" },
];

export const services: Service[] = [
  { id: "SRV-01", name: "ECG Test", department: "Cardiology", totalPatients: 84, totalSales: 12640 },
  { id: "SRV-02", name: "Pediatric Checkup", department: "Pediatrics", totalPatients: 64, totalSales: 9600 },
  { id: "SRV-03", name: "Skin Biopsy", department: "Dermatology", totalPatients: 22, totalSales: 5800 },
  { id: "SRV-04", name: "X-Ray", department: "Radiology", totalPatients: 78, totalSales: 7020 },
  { id: "SRV-05", name: "MRI Scan", department: "Radiology", totalPatients: 31, totalSales: 18600 },
  { id: "SRV-06", name: "Hearing Test", department: "Audiology", totalPatients: 56, totalSales: 6720 },
  { id: "SRV-07", name: "Joint Replacement Consult", department: "Orthopedics", totalPatients: 18, totalSales: 9000 },
  { id: "SRV-08", name: "EEG Test", department: "Neurology", totalPatients: 27, totalSales: 8100 },
];

export const roles: Role[] = [
  { id: "ROL-01", name: "Doctor", members: 18, permissions: 26 },
  { id: "ROL-02", name: "Nurse", members: 24, permissions: 14 },
  { id: "ROL-03", name: "Receptionist", members: 8, permissions: 9 },
  { id: "ROL-04", name: "Lab Technician", members: 6, permissions: 11 },
  { id: "ROL-05", name: "Pharmacist", members: 4, permissions: 12 },
  { id: "ROL-06", name: "Accountant", members: 3, permissions: 8 },
  { id: "ROL-07", name: "Admin", members: 2, permissions: 32 },
  { id: "ROL-08", name: "Manager", members: 3, permissions: 22 },
];

export const employees: Employee[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `EMP-${String(1000 + i).padStart(4, "0")}`,
  name: ["Lina Cho", "Mark Iyer", "Aisha Wahby", "Sam Patel", "Erin Park", "Hugo Pereira", "Maria Cohen", "Owen Black", "Priya Rao", "Jonas Vile", "Maya Sun", "Daniel Kim", "Ana Costa", "Theo Hart", "Yuki Tanaka", "Ravi Mehta", "Sofia Vargas", "Liam Park", "Noor Hadid", "Kenji Aoki", "Eli Stone", "Cara Liu", "Ben Ozawa", "Naya Khalid"][i],
  email: `staff${i + 1}@medical.com`,
  phone: `+1 555-01${String(20 + i).padStart(2, "0")}`,
  department: departments[i % departments.length].name,
  role: roles[i % roles.length].name,
  status: i % 7 === 0 ? "inactive" : "active",
}));

export const patients: Patient[] = Array.from({ length: 22 }).map((_, i) => ({
  id: `PAT-${String(2000 + i).padStart(4, "0")}`,
  name: ["Anna Hill", "Brian Lee", "Carla Reed", "Devon Hope", "Emma Watt", "Faruk Imran", "Greta Bohn", "Hana Otani", "Ivan Bok", "Jasmine Bey", "Karl Reed", "Lina Pratt", "Miguel Vaz", "Nala Khan", "Oren Park", "Paula Smith", "Quinn Sato", "Ravi Bose", "Sara Owen", "Tomas Vier", "Uma Patel", "Vince Hart"][i],
  email: `patient${i + 1}@example.com`,
  phone: `+1 555-02${String(10 + i).padStart(2, "0")}`,
  totalAppointments: 1 + (i % 9),
  nextAppointment: i % 4 === 0 ? "Not Scheduled" : `${(i % 28) + 1} Jan 2026`,
  employee: employees[i % employees.length].name,
  registered: `${2023 + (i % 3)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
}));

export const appointments: Appointment[] = Array.from({ length: 22 }).map((_, i) => ({
  id: `APT-${String(3000 + i).padStart(4, "0")}`,
  patientName: patients[i % patients.length].name,
  type: (["Zoom", "In-Person", "Phone"] as const)[i % 3],
  details: services[i % services.length].name,
  date: `${(i % 28) + 1} Dec 2025`,
  time: `${String(9 + (i % 8)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
  employee: employees[i % employees.length].name,
  status: (["upcoming", "done", "cancelled"] as const)[i % 3],
}));

export const schedules: Schedule[] = appointments.slice(0, 14).map((a, i) => ({
  id: `SCH-${String(4000 + i).padStart(4, "0")}`,
  service: a.details,
  sessionType: a.type,
  period: `${30 + i * 5} min`,
  date: a.date,
  time: a.time,
  employee: a.employee,
}));

export const holidays: Holiday[] = [
  { id: "HOL-01", employee: "All Staff", period: "1 day", date: "2026-01-01", reason: "New Year", type: "holiday" },
  { id: "HOL-02", employee: "All Staff", period: "1 day", date: "2026-07-04", reason: "Independence Day", type: "holiday" },
  { id: "HOL-03", employee: "Lina Cho", period: "3 days", date: "2026-02-10", reason: "Family event", type: "leave" },
  { id: "HOL-04", employee: "Mark Iyer", period: "1 day", date: "2026-02-14", reason: "Personal", type: "leave" },
  { id: "HOL-05", employee: "Sam Patel", period: "5 days", date: "2026-03-04", reason: "Vacation", type: "leave" },
  { id: "HOL-06", employee: "Erin Park", period: "2 days", date: "2026-03-15", reason: "Sick", type: "leave" },
];

export const evaluations: EvaluationDef[] = [
  { id: "EVL-01", name: "Hearing Test", submissions: 124 },
  { id: "EVL-02", name: "Vision Screening", submissions: 86 },
  { id: "EVL-03", name: "Posture Assessment", submissions: 41 },
  { id: "EVL-04", name: "Stress Index", submissions: 67 },
];

export const evaluationSubmissions: EvaluationSubmission[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `SUB-${String(5000 + i).padStart(4, "0")}`,
  evaluationName: evaluations[i % evaluations.length].name,
  email: `respondent${i + 1}@example.com`,
  score: 35 + (i * 7) % 65,
  result: i % 3 === 0 ? "Excellent" : i % 3 === 1 ? "Good" : "Needs Attention",
  date: `${(i % 28) + 1} Dec 2025`,
}));

export const blogCategories: BlogCategory[] = [
  { id: "BCT-01", name: "Health Tips", blogs: 18 },
  { id: "BCT-02", name: "Patient Stories", blogs: 9 },
  { id: "BCT-03", name: "Research", blogs: 12 },
  { id: "BCT-04", name: "Nutrition", blogs: 14 },
  { id: "BCT-05", name: "Mental Health", blogs: 7 },
];

export const blogs: Blog[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `BLG-${String(6000 + i).padStart(4, "0")}`,
  title: ["Heart-healthy habits", "How to read your labs", "Sleep and your brain", "Vitamin D explained", "Talking to kids about anxiety", "Stretching at your desk", "Telehealth 101", "Hydration basics", "Recovering from a sprain", "Migraine triggers", "Choosing the right sunscreen", "Senior fitness", "When to see a cardiologist", "Antibiotic resistance"][i],
  creator: employees[i % employees.length].name,
  category: blogCategories[i % blogCategories.length].name,
  status: (["approved", "pending", "declined"] as const)[i % 3],
  date: `${(i % 28) + 1} Dec 2025`,
}));

export const mails: MailMessage[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `MAIL-${String(7000 + i).padStart(4, "0")}`,
  from: `person${i + 1}@example.com`,
  to: "clinic@medical.com",
  subject: ["Appointment confirmation", "Lab results", "Refill request", "Insurance question", "Billing question", "Schedule change", "Telehealth invite", "Referral", "Welcome", "Feedback"][i],
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis neque dapibus elit vestibulum interdum.",
  date: `${(i % 28) + 1} Dec 2025`,
  read: i % 3 !== 0,
  folder: i % 4 === 0 ? "sent" : "inbox",
}));

export const contactRequests: ContactRequest[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `CRQ-${String(8000 + i).padStart(4, "0")}`,
  name: ["Sara Park", "Joe Davis", "Mira Khan", "Tom Lin", "Ines Roth", "Beto Cruz", "Lily Wong", "Ari Cohen"][i],
  phone: `+1 555-03${String(10 + i).padStart(2, "0")}`,
  email: `contact${i + 1}@example.com`,
  message: "I'd like to know more about your services and availability.",
  date: `${(i % 28) + 1} Dec 2025`,
  status: i % 3 === 0 ? "replied" : "new",
}));

export const incomeRecords: IncomeRecord[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `INC-${String(9000 + i).padStart(4, "0")}`,
  invoice: `INV-${String(20000 + i).padStart(5, "0")}`,
  patient: patients[i % patients.length].name,
  date: `${(i % 28) + 1} Dec 2025`,
  description: services[i % services.length].name,
  employee: employees[i % employees.length].name,
  service: services[i % services.length].name,
  amount: 60 + (i * 35) % 700,
}));

export const expenseRecords: ExpenseRecord[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `EXP-${String(9500 + i).padStart(4, "0")}`,
  invoice: `EXP-${String(30000 + i).padStart(5, "0")}`,
  date: `${(i % 28) + 1} Dec 2025`,
  description: ["Office supplies", "Rent", "Utilities", "Insurance", "Marketing", "Software", "Cleaning", "Equipment maintenance", "Training", "Travel", "Lab supplies", "Pharmacy stock"][i],
  head: ["Operations", "Rent", "Utilities", "Insurance", "Marketing", "Software", "Operations", "Operations", "HR", "Travel", "Lab", "Pharmacy"][i],
  amount: 80 + (i * 41) % 1200,
}));

export const appointmentSeries = [
  { month: "Jan", appts: 24 },
  { month: "Feb", appts: 30 },
  { month: "Mar", appts: 35 },
  { month: "Apr", appts: 28 },
  { month: "May", appts: 39 },
  { month: "Jun", appts: 44 },
  { month: "Jul", appts: 41 },
  { month: "Aug", appts: 48 },
  { month: "Sep", appts: 52 },
  { month: "Oct", appts: 49 },
  { month: "Nov", appts: 55 },
  { month: "Dec", appts: 60 },
];

// Sidebar entries for the clinic side, mirroring the Figma sidebar.
export const clinicNav = [
  { label: "Clinic Dashboard", href: "/admin/clinic", icon: "Stethoscope" },
  { label: "Team", href: "/admin/clinic/team", icon: "Users" },
  { label: "Roles", href: "/admin/clinic/roles", icon: "ShieldCheck" },
  { label: "Departments", href: "/admin/clinic/departments", icon: "Building2" },
  { label: "Services", href: "/admin/clinic/services", icon: "Activity" },
  { label: "Patients", href: "/admin/clinic/patients", icon: "HeartPulse" },
  { label: "Appointments", href: "/admin/clinic/appointments", icon: "CalendarCheck" },
  { label: "Schedule", href: "/admin/clinic/schedule", icon: "CalendarDays" },
  { label: "Holiday & Leave", href: "/admin/clinic/holidays", icon: "Plane" },
  { label: "Evaluations", href: "/admin/clinic/evaluations", icon: "ClipboardList" },
  { label: "Blog Categories", href: "/admin/clinic/blog-categories", icon: "Folders" },
  { label: "Blog", href: "/admin/clinic/blog", icon: "Newspaper" },
  { label: "Mail", href: "/admin/clinic/mail", icon: "Mail" },
  { label: "Contact Us", href: "/admin/clinic/contact", icon: "MessageSquare" },
  { label: "Accounting", href: "/admin/clinic/accounting", icon: "Wallet" },
  { label: "Website Setup", href: "/admin/website-setup", icon: "Globe" },
] as const;
