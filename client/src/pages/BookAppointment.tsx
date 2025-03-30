import { useState, useContext } from "react";
import { useParams, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserContext } from "@/App";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

// Schema for form validation
const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  reason: z.string().min(5, { message: "Please provide a reason for your visit" }),
  useInsurance: z.boolean().default(false),
  appointmentType: z.enum(["in-person", "virtual"]),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

const BookAppointment = () => {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const [selectedTab, setSelectedTab] = useState("search");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  // Get the doctor ID from the URL params if available
  const doctorId = params.doctorId ? parseInt(params.doctorId) : undefined;
  
  // Fetch all doctors
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['/api/doctors'],
  });

  // Fetch specific doctor if doctorId is available
  const { data: doctor } = useQuery({
    queryKey: [`/api/doctors/${doctorId}`],
    enabled: !!doctorId,
    onSuccess: (data) => {
      setSelectedDoctor(data);
      setSelectedTab("select-time");
    },
  });

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "",
      reason: "",
      useInsurance: false,
      appointmentType: "in-person",
      termsAccepted: false,
    },
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest("POST", "/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/appointments/patient/${user?.id}`] });
      toast({
        title: "Appointment Confirmed!",
        description: "Your appointment has been successfully scheduled.",
      });
      navigate("/profile");
    },
    onError: (error) => {
      toast({
        title: "Error scheduling appointment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Time slots
  const timeSlots = [
    "9:00 AM", "10:30 AM", "11:45 AM", "1:15 PM",
    "2:00 PM", "3:30 PM", "4:45 PM", "5:15 PM"
  ];

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!selectedDoctor) {
      toast({
        title: "Doctor Required",
        description: "Please select a doctor",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Time Selection Required",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      });
      return;
    }

    // Format the date and time
    const [hours, minutes] = selectedTime.split(':');
    const isPM = selectedTime.includes('PM');
    const formattedHours = parseInt(hours) + (isPM && parseInt(hours) !== 12 ? 12 : 0);
    
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(formattedHours);
    appointmentDate.setMinutes(parseInt(minutes));

    // Create appointment
    createAppointmentMutation.mutate({
      patientId: user.id,
      doctorId: selectedDoctor.id,
      date: appointmentDate.toISOString(),
      status: "scheduled",
      type: data.appointmentType,
      reason: data.reason,
      notes: ""
    });

    setSelectedTab("confirm");
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    setSelectedTab("select-time");
  };

  // Generate date buttons for the next 7 days
  const dateButtons = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dateButtons.push(date);
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">Book an Appointment</h1>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">Schedule your visit in just a few simple steps</p>
        
        <div className="mb-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="search">1. Search Doctor</TabsTrigger>
              <TabsTrigger value="select-time" disabled={!selectedDoctor}>2. Select Time</TabsTrigger>
              <TabsTrigger value="patient-info" disabled={!selectedDoctor || !selectedTime}>3. Patient Info</TabsTrigger>
              <TabsTrigger value="confirm" disabled={true}>4. Confirm</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                      <FormLabel>Appointment Type</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="relative bg-white border rounded-md px-6 py-4 flex cursor-pointer border-primary ring-2 ring-primary">
                          <div className="flex items-center h-5">
                            <input id="in-person" name="appointment-type" type="radio" className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" defaultChecked />
                          </div>
                          <div className="ml-3 flex flex-col">
                            <label htmlFor="in-person" className="text-sm font-medium text-gray-900">In-Person Visit</label>
                            <p className="text-gray-500 text-xs">Visit the doctor's office</p>
                          </div>
                        </div>
                        <div className="relative bg-white border rounded-md px-6 py-4 flex cursor-pointer">
                          <div className="flex items-center h-5">
                            <input id="virtual" name="appointment-type" type="radio" className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                          </div>
                          <div className="ml-3 flex flex-col">
                            <label htmlFor="virtual" className="text-sm font-medium text-gray-900">Virtual Visit</label>
                            <p className="text-gray-500 text-xs">Consult via video call</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {doctorId ? (
                      <div className="mb-6">
                        {isLoadingDoctors ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading doctor information...</p>
                          </div>
                        ) : (
                          <div className="bg-primary-50 border-l-4 border-primary p-4">
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                              <div className="ml-3">
                                <p className="text-sm text-primary-700">
                                  Selected Doctor: <strong>{`Dr. ${doctor?.id === 1 ? 'Sarah Johnson' : doctor?.id === 2 ? 'James Wilson' : doctor?.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</strong> ({doctor?.specialty})
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-6">
                        <FormLabel htmlFor="appointment-search">Search by Specialty, Doctor, or Condition</FormLabel>
                        <div className="relative mt-2">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <Input
                            id="appointment-search"
                            type="text"
                            className="pl-10"
                            placeholder="e.g., Cardiology, Dr. Johnson, Heart issues..."
                          />
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-3">Available Doctors</h3>
                          {isLoadingDoctors ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                              <p className="mt-2 text-gray-600">Loading doctors...</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {doctors?.map((doctor: any) => (
                                <div 
                                  key={doctor.id} 
                                  className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm cursor-pointer transition-all"
                                  onClick={() => handleDoctorSelect(doctor)}
                                >
                                  <div className="flex items-start">
                                    <img
                                      className="h-16 w-16 rounded-full object-cover"
                                      src={doctor.imageUrl}
                                      alt={`Dr. ${doctor.name}`}
                                    />
                                    <div className="ml-4 flex-1">
                                      <div className="flex justify-between">
                                        <h4 className="text-lg font-semibold text-gray-900">{`Dr. ${doctor.id === 1 ? 'Sarah Johnson' : doctor.id === 2 ? 'James Wilson' : doctor.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</h4>
                                        <div className="flex items-center text-yellow-400">
                                          <Star className="h-4 w-4 fill-current" />
                                          <span className="ml-1 text-gray-600 text-sm">{doctor.rating}</span>
                                        </div>
                                      </div>
                                      <p className="text-primary">{doctor.specialty}</p>
                                      <div className="flex items-center mt-1 text-gray-500 text-sm">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {doctor.location}
                                      </div>
                                      <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-gray-500">Next available: <span className="font-medium">{doctor.id === 1 ? 'Today, 2:00 PM' : doctor.id === 2 ? 'Tomorrow, 10:30 AM' : doctor.id === 3 ? 'Friday, 3:15 PM' : 'Tomorrow, 1:45 PM'}</span></span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-8">
                      <Button 
                        onClick={() => {
                          if (selectedDoctor) {
                            setSelectedTab("select-time");
                          } else if (doctorId && doctor) {
                            setSelectedDoctor(doctor);
                            setSelectedTab("select-time");
                          } else {
                            toast({
                              title: "Please select a doctor",
                              description: "You must select a doctor to continue",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Continue to Select Time
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="select-time" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center mb-6">
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={selectedDoctor?.imageUrl}
                        alt={`Dr. ${selectedDoctor?.name}`}
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{`Dr. ${selectedDoctor?.id === 1 ? 'Sarah Johnson' : selectedDoctor?.id === 2 ? 'James Wilson' : selectedDoctor?.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</h3>
                        <p className="text-primary">{selectedDoctor?.specialty}</p>
                        <p className="text-gray-500 flex items-center"><MapPin className="h-4 w-4 mr-1" /> {selectedDoctor?.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-1" /> Select a Date
                        </h4>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="border rounded-md"
                          disabled={{ before: new Date() }}
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Clock className="h-5 w-5 mr-1" /> Select a Time
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              className={`py-2 px-4 text-center ${time === "1:15 PM" ? "opacity-50 cursor-not-allowed" : ""}`}
                              onClick={() => time !== "1:15 PM" && setSelectedTime(time)}
                              disabled={time === "1:15 PM"}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                        
                        {selectedDate && selectedTime && (
                          <div className="mt-6 bg-primary-50 border-l-4 border-primary p-4">
                            <p className="text-sm text-primary-700">
                              <strong>Selected appointment time:</strong> {format(selectedDate, "PPPP")} at {selectedTime}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedTab("search")}
                      >
                        Back to Search
                      </Button>
                      <Button 
                        onClick={() => {
                          if (!selectedTime) {
                            toast({
                              title: "Please select a time",
                              description: "You must select a time to continue",
                              variant: "destructive",
                            });
                            return;
                          }
                          setSelectedTab("patient-info");
                        }}
                      >
                        Continue to Patient Info
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="patient-info" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="max-w-3xl mx-auto">
                    <div className="bg-primary-50 border-l-4 border-primary p-4 mb-6">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div className="ml-3">
                          <p className="text-sm text-primary-700">
                            You're booking an appointment with <strong>{`Dr. ${selectedDoctor?.id === 1 ? 'Sarah Johnson' : selectedDoctor?.id === 2 ? 'James Wilson' : selectedDoctor?.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</strong> for <strong>{selectedDate && format(selectedDate, "EEEE, MMM d")} at {selectedTime}</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="appointmentType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Appointment Type</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="in-person" id="in-person-type" />
                                    <label htmlFor="in-person-type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                      In-person visit
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="virtual" id="virtual-type" />
                                    <label htmlFor="virtual-type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                      Virtual consultation
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reason for Visit</FormLabel>
                              <FormControl>
                                <Textarea rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="useInsurance"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>I'll be using insurance</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-between mt-8">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setSelectedTab("select-time")}
                          >
                            Back to Select Time
                          </Button>
                          <Button type="submit">
                            {createAppointmentMutation.isPending ? (
                              <>
                                <span className="animate-spin mr-2">◐</span>
                                Confirming...
                              </>
                            ) : (
                              "Confirm Appointment"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="confirm" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="max-w-3xl mx-auto">
                    <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden mb-6">
                      <div className="bg-primary px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-white">Appointment Summary</h3>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Doctor</dt>
                            <dd className="mt-1 text-sm text-gray-900">{`Dr. ${selectedDoctor?.id === 1 ? 'Sarah Johnson' : selectedDoctor?.id === 2 ? 'James Wilson' : selectedDoctor?.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Specialty</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedDoctor?.specialty}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Time</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedTime}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedDoctor?.location}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Appointment Type</dt>
                            <dd className="mt-1 text-sm text-gray-900">{form.getValues().appointmentType === "in-person" ? "In-Person Visit" : "Virtual Visit"}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Reason for Visit</dt>
                            <dd className="mt-1 text-sm text-gray-900">{form.getValues().reason}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden mb-6">
                      <div className="bg-gray-50 px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Patient Information</h3>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">First Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{form.getValues().firstName}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{form.getValues().lastName}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900">{form.getValues().email}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="mt-1 text-sm text-gray-900">{form.getValues().phone}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-8">
                      <Link href="/profile">
                        <Button className="px-8">
                          View All Appointments
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default BookAppointment;
