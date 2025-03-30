import { 
  users, type User, type InsertUser,
  doctors, type Doctor, type InsertDoctor,
  appointments, type Appointment, type InsertAppointment,
  insuranceOptions, type InsuranceOption, type InsertInsuranceOption,
  assistancePrograms, type AssistanceProgram, type InsertAssistanceProgram
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Doctor operations
  getDoctor(id: number): Promise<Doctor | undefined>;
  getDoctors(): Promise<Doctor[]>;
  getDoctorsBySpecialty(specialty: string): Promise<Doctor[]>;
  getDoctorsByLocation(location: string): Promise<Doctor[]>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(id: number, doctorData: Partial<Doctor>): Promise<Doctor | undefined>;
  
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByPatient(patientId: number): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment | undefined>;
  
  // Insurance operations
  getInsuranceOption(id: number): Promise<InsuranceOption | undefined>;
  getInsuranceOptions(): Promise<InsuranceOption[]>;
  createInsuranceOption(insuranceOption: InsertInsuranceOption): Promise<InsuranceOption>;
  
  // Assistance program operations
  getAssistanceProgram(id: number): Promise<AssistanceProgram | undefined>;
  getAssistancePrograms(): Promise<AssistanceProgram[]>;
  createAssistanceProgram(assistanceProgram: InsertAssistanceProgram): Promise<AssistanceProgram>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private doctorsMap: Map<number, Doctor>;
  private appointmentsMap: Map<number, Appointment>;
  private insuranceOptionsMap: Map<number, InsuranceOption>;
  private assistanceProgramsMap: Map<number, AssistanceProgram>;
  
  private userId: number;
  private doctorId: number;
  private appointmentId: number;
  private insuranceOptionId: number;
  private assistanceProgramId: number;

  constructor() {
    this.usersMap = new Map();
    this.doctorsMap = new Map();
    this.appointmentsMap = new Map();
    this.insuranceOptionsMap = new Map();
    this.assistanceProgramsMap = new Map();
    
    this.userId = 1;
    this.doctorId = 1;
    this.appointmentId = 1;
    this.insuranceOptionId = 1;
    this.assistanceProgramId = 1;
    
    // Add some initial sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample doctors
    const sampleDoctors = [
      {
        id: this.doctorId++,
        userId: 0, 
        specialty: "Cardiology",
        location: "New York, NY",
        about: "Experienced cardiologist specializing in heart health and preventive care.",
        education: "MD from Johns Hopkins University",
        experience: "15",
        rating: "4.8",
        reviewCount: 120,
        availability: JSON.stringify({
          monday: ["09:00", "10:30", "14:00", "15:30"],
          tuesday: ["09:00", "10:30", "14:00", "15:30"],
          wednesday: ["09:00", "10:30", "14:00", "15:30"],
          thursday: ["09:00", "10:30", "14:00", "15:30"],
          friday: ["09:00", "10:30", "14:00", "15:30"],
        }),
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
      },
      {
        id: this.doctorId++,
        userId: 0,
        specialty: "Family Medicine",
        location: "Chicago, IL",
        about: "Dedicated to providing comprehensive care for the entire family.",
        education: "MD from University of Chicago",
        experience: "10",
        rating: "4.0",
        reviewCount: 85,
        availability: JSON.stringify({
          monday: ["08:00", "09:30", "11:00", "15:00"],
          tuesday: ["08:00", "09:30", "11:00", "15:00"],
          wednesday: ["08:00", "09:30", "11:00", "15:00"],
          thursday: ["08:00", "09:30", "11:00", "15:00"],
          friday: ["08:00", "09:30", "11:00", "15:00"],
        }),
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
      },
      {
        id: this.doctorId++,
        userId: 0,
        specialty: "Dermatology",
        location: "Los Angeles, CA",
        about: "Specialized in skin conditions and dermatological treatments.",
        education: "MD from UCLA",
        experience: "12",
        rating: "5.0",
        reviewCount: 142,
        availability: JSON.stringify({
          monday: ["10:00", "11:30", "13:00", "16:30"],
          tuesday: ["10:00", "11:30", "13:00", "16:30"],
          wednesday: ["10:00", "11:30", "13:00", "16:30"],
          thursday: ["10:00", "11:30", "13:00", "16:30"],
          friday: ["10:00", "11:30", "13:00", "16:30"],
        }),
        imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
      },
      {
        id: this.doctorId++,
        userId: 0,
        specialty: "Pediatrics",
        location: "Houston, TX",
        about: "Dedicated to providing the best care for children of all ages.",
        education: "MD from Baylor College of Medicine",
        experience: "8",
        rating: "4.7",
        reviewCount: 98,
        availability: JSON.stringify({
          monday: ["09:00", "10:30", "13:45", "15:15"],
          tuesday: ["09:00", "10:30", "13:45", "15:15"],
          wednesday: ["09:00", "10:30", "13:45", "15:15"],
          thursday: ["09:00", "10:30", "13:45", "15:15"],
          friday: ["09:00", "10:30", "13:45", "15:15"],
        }),
        imageUrl: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db",
      },
    ];

    sampleDoctors.forEach(doctor => {
      this.doctorsMap.set(doctor.id, doctor as Doctor);
    });

    // Add sample insurance options
    const sampleInsuranceOptions = [
      {
        id: this.insuranceOptionId++,
        name: "Blue Cross Blue Shield",
        type: "Private",
        description: "Comprehensive health insurance coverage with a wide network of providers.",
        coverageDetails: "Covers preventive care, specialist visits, emergency services, and prescription drugs.",
        contactInfo: "1-800-123-4567, info@bcbs.com",
      },
      {
        id: this.insuranceOptionId++,
        name: "Aetna Health",
        type: "Private",
        description: "Flexible plans designed to fit your needs and budget.",
        coverageDetails: "Options for individuals, families, and employers with varying deductibles and copays.",
        contactInfo: "1-800-987-6543, support@aetna.com",
      },
    ];

    sampleInsuranceOptions.forEach(option => {
      this.insuranceOptionsMap.set(option.id, option as InsuranceOption);
    });

    // Add sample assistance programs
    const sampleAssistancePrograms = [
      {
        id: this.assistanceProgramId++,
        name: "Medicaid",
        description: "Federal and state program that helps with medical costs for some people with limited income and resources.",
        eligibilityCriteria: "Based on income, household size, disability, family status, and other factors.",
        applicationProcess: "Apply through your state Medicaid agency or the Health Insurance Marketplace.",
        contactInfo: "Visit www.medicaid.gov or call 1-877-267-2323",
      },
      {
        id: this.assistanceProgramId++,
        name: "Medicare",
        description: "Federal health insurance program for people who are 65 or older, certain younger people with disabilities, and people with End-Stage Renal Disease.",
        eligibilityCriteria: "Age 65 or older, under 65 with certain disabilities, or any age with End-Stage Renal Disease.",
        applicationProcess: "Apply through Social Security online, by phone, or in person.",
        contactInfo: "1-800-MEDICARE (1-800-633-4227), www.medicare.gov",
      },
      {
        id: this.assistanceProgramId++,
        name: "Children's Health Insurance Program (CHIP)",
        description: "Provides low-cost health coverage to children in families that earn too much money to qualify for Medicaid but can't afford private insurance.",
        eligibilityCriteria: "Eligibility varies by state but generally covers children up to age 19 in families with incomes up to 200% of the federal poverty level.",
        applicationProcess: "Apply through your state CHIP agency or the Health Insurance Marketplace.",
        contactInfo: "Visit www.insurekidsnow.gov or call 1-877-KIDS-NOW",
      },
    ];

    sampleAssistancePrograms.forEach(program => {
      this.assistanceProgramsMap.set(program.id, program as AssistanceProgram);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { 
      ...user, 
      id,
      createdAt: new Date()
    };
    this.usersMap.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  // Doctor operations
  async getDoctor(id: number): Promise<Doctor | undefined> {
    return this.doctorsMap.get(id);
  }

  async getDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctorsMap.values());
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return Array.from(this.doctorsMap.values()).filter(
      (doctor) => doctor.specialty === specialty,
    );
  }

  async getDoctorsByLocation(location: string): Promise<Doctor[]> {
    return Array.from(this.doctorsMap.values()).filter(
      (doctor) => doctor.location.includes(location),
    );
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const id = this.doctorId++;
    const newDoctor: Doctor = { ...doctor, id };
    this.doctorsMap.set(id, newDoctor);
    return newDoctor;
  }

  async updateDoctor(id: number, doctorData: Partial<Doctor>): Promise<Doctor | undefined> {
    const doctor = this.doctorsMap.get(id);
    if (!doctor) return undefined;
    
    const updatedDoctor = { ...doctor, ...doctorData };
    this.doctorsMap.set(id, updatedDoctor);
    return updatedDoctor;
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointmentsMap.get(id);
  }

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return Array.from(this.appointmentsMap.values()).filter(
      (appointment) => appointment.patientId === patientId,
    );
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return Array.from(this.appointmentsMap.values()).filter(
      (appointment) => appointment.doctorId === doctorId,
    );
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentId++;
    const newAppointment: Appointment = { 
      ...appointment, 
      id,
      createdAt: new Date()
    };
    this.appointmentsMap.set(id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointmentsMap.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...appointmentData };
    this.appointmentsMap.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Insurance operations
  async getInsuranceOption(id: number): Promise<InsuranceOption | undefined> {
    return this.insuranceOptionsMap.get(id);
  }

  async getInsuranceOptions(): Promise<InsuranceOption[]> {
    return Array.from(this.insuranceOptionsMap.values());
  }

  async createInsuranceOption(insuranceOption: InsertInsuranceOption): Promise<InsuranceOption> {
    const id = this.insuranceOptionId++;
    const newInsuranceOption: InsuranceOption = { ...insuranceOption, id };
    this.insuranceOptionsMap.set(id, newInsuranceOption);
    return newInsuranceOption;
  }

  // Assistance program operations
  async getAssistanceProgram(id: number): Promise<AssistanceProgram | undefined> {
    return this.assistanceProgramsMap.get(id);
  }

  async getAssistancePrograms(): Promise<AssistanceProgram[]> {
    return Array.from(this.assistanceProgramsMap.values());
  }

  async createAssistanceProgram(assistanceProgram: InsertAssistanceProgram): Promise<AssistanceProgram> {
    const id = this.assistanceProgramId++;
    const newAssistanceProgram: AssistanceProgram = { ...assistanceProgram, id };
    this.assistanceProgramsMap.set(id, newAssistanceProgram);
    return newAssistanceProgram;
  }
}

export const storage = new MemStorage();
