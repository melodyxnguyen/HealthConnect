import { useState, useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserContext } from "@/App";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CalendarPlus, 
  Calendar, 
  User, 
  FileText, 
  ClipboardEdit,
  Video,
  AlertCircle,
  Pencil,
  X,
  CheckCircle2
} from "lucide-react";

// Form schema for user profile update
const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  insuranceInfo: z.string().optional(),
  medicalHistory: z.string().optional(),
});

const Profile = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);

  // Redirect to login if no user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Setup form with default values from user context
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "",
      insuranceInfo: "",
      medicalHistory: "",
    },
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: "", // Add user.phone when available
        insuranceInfo: "", // Add user.insuranceInfo when available
        medicalHistory: "", // Add user.medicalHistory when available
      });
    }
  }, [user, form]);

  // Fetch user appointments
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: [`/api/appointments/patient/${user?.id}`],
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: z.infer<typeof profileFormSchema>) => 
      apiRequest("PATCH", `/api/users/${user?.id}`, data),
    onSuccess: async (response) => {
      const updatedUser = await response.json();
      setUser({
        ...user!,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: (appointmentId: number) => 
      apiRequest("PATCH", `/api/appointments/${appointmentId}`, { status: "cancelled" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/appointments/patient/${user?.id}`] });
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Cancellation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
    updateProfileMutation.mutate(data);
  };

  if (!user) {
    return null; // Redirect will happen via useEffect
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient Profile</h1>
        
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="medical">
              <FileText className="h-4 w-4 mr-2" />
              Medical Records
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
                <CardDescription>
                  View and manage your scheduled medical appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : appointments && appointments.length > 0 ? (
                  <Table>
                    <TableCaption>A list of your recent appointments</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment: any) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            {format(new Date(appointment.date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {format(new Date(appointment.date), "h:mm a")}
                          </TableCell>
                          <TableCell>
                            Dr. {appointment.doctorId === 1 ? 'Sarah Johnson' : 
                                appointment.doctorId === 2 ? 'James Wilson' : 
                                appointment.doctorId === 3 ? 'Michael Chen' : 
                                'Emily Rodriguez'}
                          </TableCell>
                          <TableCell>
                            {appointment.type === "virtual" ? (
                              <Badge variant="outline" className="flex items-center w-fit gap-1">
                                <Video className="h-3 w-3" />
                                Virtual
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="flex items-center w-fit gap-1">
                                <User className="h-3 w-3" />
                                In-Person
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                appointment.status === "scheduled" ? "default" :
                                appointment.status === "completed" ? "secondary" :
                                appointment.status === "cancelled" ? "destructive" :
                                "outline"
                              }
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {appointment.status === "scheduled" && (
                              <div className="flex justify-end gap-2">
                                {appointment.type === "virtual" && new Date(appointment.date) > new Date() && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate("/telemedicine")}
                                  >
                                    <Video className="h-4 w-4 mr-1" />
                                    Join
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/book-appointment/${appointment.doctorId}`)}
                                >
                                  <ClipboardEdit className="h-4 w-4 mr-1" />
                                  Reschedule
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to cancel this appointment?")) {
                                      cancelAppointmentMutation.mutate(appointment.id);
                                    }
                                  }}
                                  disabled={cancelAppointmentMutation.isPending}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            )}
                            {appointment.status === "completed" && (
                              <Button variant="outline" size="sm">
                                View Summary
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Calendar className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
                    <p className="text-gray-500 mb-4">You haven't scheduled any appointments yet.</p>
                    <Button onClick={() => navigate("/find-doctors")}>
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Book an Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/find-doctors")}>Find Doctors</Button>
                <Button onClick={() => navigate("/book-appointment")}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Book New Appointment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your personal and contact information
                  </CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {isEditing ? (
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
                              <Input {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="insuranceInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Information</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Enter your insurance provider, policy number, and other relevant details."
                              />
                            </FormControl>
                            <FormDescription>
                              This information will be used to process insurance claims for your appointments.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? (
                            <>
                              <span className="animate-spin mr-2">◐</span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="mt-1 text-sm text-gray-900">{user.firstName} {user.lastName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="mt-1 text-sm text-gray-900">{form.watch("phone") || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">User Since</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : "N/A"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Insurance Information</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {form.watch("insuranceInfo") || "No insurance information provided"}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        <p className="text-sm text-gray-600">
                          To update your personal information, click the "Edit Profile" button above.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
                <CardDescription>
                  View and manage your medical history and health records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Medical History</h3>
                    <FormField
                      control={form.control}
                      name="medicalHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter your medical history, including any chronic conditions, previous surgeries, allergies, and current medications."
                              rows={6}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormDescription>
                            This information will be shared with your healthcare providers to ensure you receive appropriate care.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end mt-4">
                      <Button>Save Medical History</Button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Medical Records</h3>
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-900 mb-1">No records available</h4>
                      <p className="text-gray-500 mb-4">Medical records will appear here after your appointments.</p>
                      <Button variant="outline">Upload Medical Documents</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Download Records</Button>
                <Button>Request Medical Information</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
