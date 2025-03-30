import { useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { UserContext } from "@/App";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { CalendarIcon, Users, Activity, User, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Dashboard charts data
const appointmentsBySpecialty = [
  { name: "Cardiology", value: 32 },
  { name: "Dermatology", value: 28 },
  { name: "Family Medicine", value: 45 },
  { name: "Pediatrics", value: 37 },
  { name: "Neurology", value: 19 },
];

const appointmentsByType = [
  { name: "In-Person", value: 75 },
  { name: "Virtual", value: 25 },
];

const weeklyAppointments = [
  { day: "Mon", appointments: 12 },
  { day: "Tue", appointments: 18 },
  { day: "Wed", appointments: 15 },
  { day: "Thu", appointments: 22 },
  { day: "Fri", appointments: 19 },
  { day: "Sat", appointments: 10 },
  { day: "Sun", appointments: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard = () => {
  const [, navigate] = useLocation();
  const { user } = useContext(UserContext);

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch all doctors
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['/api/doctors'],
  });

  // Fetch all appointments
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['/api/appointments/doctor/1'], // Just for demo, in real app would fetch all
  });

  // Fetch all users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['/api/users/1'], // Just for demo, in real app would fetch all
    enabled: false, // Disable for demo
  });

  if (!user || user.role !== "admin") {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Last updated:</span>
            <span className="text-sm font-medium">{format(new Date(), "MMMM d, yyyy h:mm a")}</span>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Doctors</p>
                  <p className="text-3xl font-bold">{isLoadingDoctors ? "..." : doctors?.length || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-green-500 font-medium flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  12%
                </span>
                <span className="text-gray-500 ml-2">since last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <p className="text-3xl font-bold">248</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-green-500 font-medium flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  18%
                </span>
                <span className="text-gray-500 ml-2">since last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Weekly Appointments</p>
                  <p className="text-3xl font-bold">123</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-red-500 font-medium flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  4%
                </span>
                <span className="text-gray-500 ml-2">since last week</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <p className="text-3xl font-bold">65%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-green-500 font-medium flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  7%
                </span>
                <span className="text-gray-500 ml-2">since last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appointments by Specialty Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Appointments by Specialty</CardTitle>
                  <CardDescription>Distribution of appointments across medical specialties</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentsBySpecialty}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {appointmentsBySpecialty.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Weekly Appointments Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Appointment Volume</CardTitle>
                  <CardDescription>Number of appointments per day this week</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyAppointments}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#1a56db" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Appointment Types Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Types</CardTitle>
                  <CardDescription>Distribution between in-person and virtual appointments</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#1a56db" />
                        <Cell fill="#7dd3fc" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New appointment scheduled</p>
                        <p className="text-xs text-gray-500">John Doe with Dr. Sarah Johnson</p>
                        <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New patient registered</p>
                        <p className="text-xs text-gray-500">Emma Thompson created an account</p>
                        <p className="text-xs text-gray-500">Today, 9:15 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Appointment cancelled</p>
                        <p className="text-xs text-gray-500">Michael Brown cancelled appointment</p>
                        <p className="text-xs text-gray-500">Yesterday, 4:20 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Insurance updated</p>
                        <p className="text-xs text-gray-500">Lisa Clark updated insurance information</p>
                        <p className="text-xs text-gray-500">Yesterday, 2:35 PM</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="link" className="w-full mt-4 justify-between" onClick={() => {}}>
                    View all activity
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Doctor Management</CardTitle>
                    <CardDescription>View and manage all doctors in the system</CardDescription>
                  </div>
                  <Button onClick={() => navigate("/admin/doctors")}>Manage Doctors</Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingDoctors ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Specialty</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Reviews</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors?.map((doctor: any) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="flex items-center gap-3">
                            <img 
                              src={doctor.imageUrl} 
                              alt={`Dr. ${doctor.id === 1 ? 'Sarah Johnson' : doctor.id === 2 ? 'James Wilson' : doctor.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <span>{`Dr. ${doctor.id === 1 ? 'Sarah Johnson' : doctor.id === 2 ? 'James Wilson' : doctor.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</span>
                          </TableCell>
                          <TableCell>{doctor.specialty}</TableCell>
                          <TableCell>{doctor.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="ml-1">{doctor.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{doctor.reviewCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription>Upcoming and recent appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : appointments?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Using sample appointments for demo */}
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Dr. Sarah Johnson</TableCell>
                        <TableCell>{format(new Date(), "MMM d, yyyy h:mm a")}</TableCell>
                        <TableCell>In-Person</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Scheduled
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Emma Thompson</TableCell>
                        <TableCell>Dr. James Wilson</TableCell>
                        <TableCell>{format(new Date(Date.now() + 86400000), "MMM d, yyyy h:mm a")}</TableCell>
                        <TableCell>Virtual</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Scheduled
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Michael Brown</TableCell>
                        <TableCell>Dr. Michael Chen</TableCell>
                        <TableCell>{format(new Date(Date.now() - 86400000), "MMM d, yyyy h:mm a")}</TableCell>
                        <TableCell>In-Person</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Cancelled
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Lisa Clark</TableCell>
                        <TableCell>Dr. Emily Rodriguez</TableCell>
                        <TableCell>{format(new Date(Date.now() - 172800000), "MMM d, yyyy h:mm a")}</TableCell>
                        <TableCell>Virtual</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Completed
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10">
                    <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
                    <p className="text-gray-500 mb-4">There are currently no appointments in the system.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>View and manage patient information</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Total Appointments</TableHead>
                        <TableHead>Registered On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sample patient data for demo */}
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>john.doe@example.com</TableCell>
                        <TableCell>(123) 456-7890</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>{format(new Date(2023, 5, 15), "MMM d, yyyy")}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Emma Thompson</TableCell>
                        <TableCell>emma.thompson@example.com</TableCell>
                        <TableCell>(234) 567-8901</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>{format(new Date(2023, 7, 22), "MMM d, yyyy")}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Michael Brown</TableCell>
                        <TableCell>michael.brown@example.com</TableCell>
                        <TableCell>(345) 678-9012</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>{format(new Date(2023, 8, 10), "MMM d, yyyy")}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Lisa Clark</TableCell>
                        <TableCell>lisa.clark@example.com</TableCell>
                        <TableCell>(456) 789-0123</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>{format(new Date(2023, 6, 5), "MMM d, yyyy")}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
