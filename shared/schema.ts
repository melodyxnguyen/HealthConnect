import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  role: text("role").default("patient").notNull(),
  insuranceInfo: text("insurance_info"),
  medicalHistory: text("medical_history"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Specialty enum
export const specialtyEnum = pgEnum("specialty", [
  "Cardiology",
  "Dermatology",
  "Family Medicine",
  "Neurology",
  "Pediatrics",
  "Psychiatry",
  "Ophthalmology",
  "Orthopedics",
  "Gynecology",
  "Urology",
]);

// Doctor schema
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  specialty: text("specialty").notNull(),
  location: text("location").notNull(),
  about: text("about"),
  education: text("education"),
  experience: text("experience").default("0"),
  rating: text("rating").default("0"),
  reviewCount: integer("review_count").default(0),
  availability: text("availability"),
  imageUrl: text("image_url"),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

// Appointment status enum
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "completed",
  "cancelled",
  "no-show",
]);

// Appointment type enum
export const appointmentTypeEnum = pgEnum("appointment_type", [
  "in-person",
  "virtual",
]);

// Appointment schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").default("scheduled").notNull(),
  type: text("type").notNull(),
  reason: text("reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

// Insurance schema
export const insuranceOptions = pgTable("insurance_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  coverageDetails: text("coverage_details"),
  contactInfo: text("contact_info"),
});

export const insertInsuranceOptionSchema = createInsertSchema(insuranceOptions).omit({
  id: true,
});

// Government Assistance Program schema
export const assistancePrograms = pgTable("assistance_programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  eligibilityCriteria: text("eligibility_criteria"),
  applicationProcess: text("application_process"),
  contactInfo: text("contact_info"),
});

export const insertAssistanceProgramSchema = createInsertSchema(assistancePrograms).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type InsuranceOption = typeof insuranceOptions.$inferSelect;
export type InsertInsuranceOption = z.infer<typeof insertInsuranceOptionSchema>;

export type AssistanceProgram = typeof assistancePrograms.$inferSelect;
export type InsertAssistanceProgram = z.infer<typeof insertAssistanceProgramSchema>;
