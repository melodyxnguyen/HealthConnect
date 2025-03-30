import { useState, useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { UserContext } from "@/App";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  Trash, 
  Plus, 
  RefreshCw, 
  Star, 
  MapPin, 
  User, 
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

// Form schema for doctor creation/editing
const doctorFormSchema = z.object({
  userId: z.number().optional(),
  specialty: z.string().min(2, { message: "Specialty is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  about: z.string().min(10, { message: "About section must be at least 10 characters" }),
  education: z.string().min(2, { message: "Education information is required" }),
  experience: z.string().min(1, { message: "Experience is required" }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the doctor's image" }),
  availability: z.string().min(2, { message: "Availability information is required" }),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

const DoctorManagement = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

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
  const { data: doctors, isLoading, refetch } = useQuery({
    queryKey: ['/api/doctors'],
  });

  // Initialize form
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      location: "",
      about: "",
      education: "",
      experience: "",
      imageUrl: "",
      availability: JSON.stringify({
        monday: ["09:00", "10:30", "14:00", "15:30"],
        tuesday: ["09:00", "10:30", "14:00", "15:30"],
        wednesday: ["09:00", "10:30", "14:00", "15:30"],
        thursday: ["09:00", "10:30", "14:00", "15:30"],
        friday: ["09:00", "10:30", "14:00", "15:30"],
      }),
    },
  });

  // Update form when editing a doctor
  useEffect(() => {
    if (editingDoctor) {
      form.reset({
        userId: editingDoctor.userId || 0,
        specialty: editingDoctor.specialty || "",
        location: editingDoctor.location || "",
        about: editingDoctor.about || "",
        education: editingDoctor.education || "",
        experience: editingDoctor.experience || "",
        imageUrl: editingDoctor.imageUrl || "",
        availability: editingDoctor.availability || "",
      });
    } else {
      form.reset({
        specialty: "",
        location: "",
        about: "",
        education: "",
        experience: "",
        imageUrl: "",
        availability: JSON.stringify({
          monday: ["09:00", "10:30", "14:00", "15:30"],
          tuesday: ["09:00", "10:30", "14:00", "15:30"],
          wednesday: ["09:00", "10:30", "14:00", "15:30"],
          thursday: ["09:00", "10:30", "14:00", "15:30"],
          friday: ["09:00", "10:30", "14:00", "15:30"],
        }),
      });
    }
  }, [editingDoctor, form]);

  // Create doctor mutation
  const createDoctorMutation = useMutation({
    mutationFn: (data: DoctorFormValues) => 
      apiRequest("POST", "/api/doctors", { ...data, userId: 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      setOpenDialog(false);
      toast({
        title: "Doctor created",
        description: "The doctor has been successfully added to the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating doctor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update doctor mutation
  const updateDoctorMutation = useMutation({
    mutationFn: (data: DoctorFormValues & { id: number }) => 
      apiRequest("PATCH", `/api/doctors/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      setOpenDialog(false);
      setEditingDoctor(null);
      toast({
        title: "Doctor updated",
        description: "The doctor information has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating doctor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete doctor mutation
  const deleteDoctorMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest("DELETE", `/api/doctors/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      setIsDeleting(null);
      toast({
        title: "Doctor deleted",
        description: "The doctor has been successfully removed from the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting doctor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: DoctorFormValues) => {
    if (editingDoctor) {
      updateDoctorMutation.mutate({ ...data, id: editingDoctor.id });
    } else {
      createDoctorMutation.mutate(data);
    }
  };

  // Handle adding a new doctor
  const handleAddDoctor = () => {
    setEditingDoctor(null);
    form.reset();
    setOpenDialog(true);
  };

  // Handle editing a doctor
  const handleEditDoctor = (doctor: any) => {
    setEditingDoctor(doctor);
    setOpenDialog(true);
  };

  // Handle deleting a doctor
  const handleDeleteDoctor = (id: number) => {
    setIsDeleting(id);
    if (window.confirm("Are you sure you want to delete this doctor? This action cannot be undone.")) {
      deleteDoctorMutation.mutate(id);
    } else {
      setIsDeleting(null);
    }
  };

  // Close dialog and reset form
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDoctor(null);
    form.reset();
  };

  if (!user || user.role !== "admin") {
    return null; // Redirect will happen via useEffect
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleAddDoctor} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Doctor
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
            <CardDescription>
              Manage doctors' information, specialties, and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : doctors?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor: any) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="flex items-center gap-3">
                        <img 
                          src={doctor.imageUrl}
                          alt={`Dr. ${doctor.id === 1 ? 'Sarah Johnson' : doctor.id === 2 ? 'James Wilson' : doctor.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{`Dr. ${doctor.id === 1 ? 'Sarah Johnson' : doctor.id === 2 ? 'James Wilson' : doctor.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</div>
                          <div className="text-sm text-gray-500">ID: {doctor.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {doctor.specialty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm">{doctor.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.experience} years</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{doctor.rating}</span>
                          <span className="text-gray-500 text-xs ml-1">({doctor.reviewCount})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteDoctor(doctor.id)}
                            disabled={isDeleting === doctor.id}
                          >
                            {isDeleting === doctor.id ? (
                              <div className="animate-spin h-4 w-4">◐</div>
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <User className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No doctors found</h3>
                <p className="text-gray-500 mb-4">Add doctors to the system to get started.</p>
                <Button onClick={handleAddDoctor}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Doctor
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Doctor form dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Edit Doctor Information" : "Add New Doctor"}</DialogTitle>
              <DialogDescription>
                {editingDoctor 
                  ? "Update the doctor's details in the system." 
                  : "Fill in the details to add a new doctor to the system."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialty</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                            <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                            <SelectItem value="Neurology">Neurology</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                            <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="Gynecology">Gynecology</SelectItem>
                            <SelectItem value="Urology">Urology</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., New York, NY" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Brief description of the doctor's practice and expertise" 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., MD from Johns Hopkins University" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 15" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/doctor-image.jpg" />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for the doctor's profile image.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="JSON format of available time slots" 
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter availability in JSON format, e.g., {`{"monday": ["09:00", "10:30"], "tuesday": ["14:00", "15:30"]}`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createDoctorMutation.isPending || updateDoctorMutation.isPending}
                  >
                    {(createDoctorMutation.isPending || updateDoctorMutation.isPending) ? (
                      <>
                        <span className="animate-spin mr-2">◐</span>
                        {editingDoctor ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {editingDoctor ? "Update Doctor" : "Add Doctor"}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DoctorManagement;
