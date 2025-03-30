import { useState, useRef, useEffect, useContext } from "react";
import { useLocation } from "wouter";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  Clock,
  Clipboard,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Telemedicine = () => {
  const [, navigate] = useLocation();
  const { user } = useContext(UserContext);
  const { toast } = useToast();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [openConsultDialog, setOpenConsultDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['/api/doctors'],
  });

  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['/api/appointments/patient/1'],
    enabled: !!user,
  });

  // Function to handle starting a video call
  const startVideoCall = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start a telemedicine consultation",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    // Since this is just a UI demonstration without actual WebRTC implementation
    // we'll just update the state to show the call interface
    setIsCallActive(true);
    
    // In a real implementation, you would:
    // 1. Initialize WebRTC connection
    // 2. Get user media (camera and microphone)
    // 3. Create and exchange SDP offers/answers
    // 4. Set up ICE candidates exchange
    
    // For demo purposes, we'll use the webcam to show something in the video element
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing media devices:", err);
          toast({
            title: "Camera Access Error",
            description: "Could not access your camera or microphone. Please check permissions.",
            variant: "destructive"
          });
        });
    }
  };

  // Function to end the call
  const endCall = () => {
    // Stop all media tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    setIsCallActive(false);
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMicOn(!isMicOn);
  };

  // Toggle video
  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOn(!isVideoOn);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Cleanup when dialog closes
  useEffect(() => {
    if (!openConsultDialog && localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCallActive(false);
    }
  }, [openConsultDialog]);

  // Handle new consultation with selected doctor
  const handleConsultNow = (doctor: any) => {
    setSelectedDoctor(doctor);
    setOpenConsultDialog(true);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Virtual Care, Real Results</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with healthcare professionals from the comfort of your home through our secure telemedicine platform.
          </p>
        </div>

        <Tabs defaultValue="about" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About Telemedicine</TabsTrigger>
            <TabsTrigger value="doctors">Available Doctors</TabsTrigger>
            <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>How Telemedicine Works</CardTitle>
                <CardDescription>
                  Connect with healthcare providers virtually and receive quality care without leaving home.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                          <Video className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">High-Quality Video Consultations</h3>
                        <p className="mt-2 text-gray-600">Connect face-to-face with doctors through our secure, HIPAA-compliant video platform.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Digital Prescriptions</h3>
                        <p className="mt-2 text-gray-600">Receive prescriptions electronically and have them sent directly to your preferred pharmacy.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                          <Clipboard className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Comprehensive Care Plans</h3>
                        <p className="mt-2 text-gray-600">Receive detailed treatment plans and follow-up care instructions after your virtual visit.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                        alt="Doctor having a video consultation with patient" 
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Benefits of Telemedicine</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          No travel time or costs for medical appointments
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Reduced risk of catching contagious illnesses
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Access to specialists regardless of location
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Shorter wait times for medical consultations
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button className="w-full md:w-auto" onClick={() => navigate("/book-appointment")}>
                  Schedule a Virtual Consultation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Doctors for Telemedicine</CardTitle>
                <CardDescription>
                  These healthcare providers are currently available for virtual consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingDoctors ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctors?.map((doctor: any) => (
                      <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm">
                        <div className="flex items-start space-x-4">
                          <img
                            className="h-14 w-14 rounded-full object-cover"
                            src={doctor.imageUrl}
                            alt={`Dr. ${doctor.id === 1 ? 'Sarah Johnson' : doctor.id === 2 ? 'James Wilson' : doctor.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{`Dr. ${doctor.id === 1 ? 'Sarah Johnson' : doctor.id === 2 ? 'James Wilson' : doctor.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</h3>
                            <p className="text-primary">{doctor.specialty}</p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 ${doctor.id % 2 === 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-1.5`}></div>
                                {doctor.id % 2 === 0 ? 'Available now' : 'Busy'}
                              </div>
                              {doctor.id % 2 === 0 && (
                                <Button 
                                  size="sm" 
                                  className="ml-auto"
                                  onClick={() => handleConsultNow(doctor)}
                                >
                                  Consult Now
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              Next available: <span className="font-medium ml-1">{doctor.id === 1 ? 'Today, 2:00 PM' : doctor.id === 2 ? 'Now' : doctor.id === 3 ? 'Friday, 3:15 PM' : 'Now'}</span>
                            </div>
                            <Button variant="outline" size="sm" className="ml-auto" onClick={() => navigate(`/book-appointment/${doctor.id}`)}>
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Telemedicine Appointments</CardTitle>
                <CardDescription>
                  View and manage your upcoming virtual consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-10">
                    <p className="text-gray-600 mb-4">Please sign in to view your appointments</p>
                    <Button onClick={() => navigate("/login")}>Sign In</Button>
                  </div>
                ) : isLoadingAppointments ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : appointments && appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.filter((apt: any) => apt.type === "virtual").length > 0 ? (
                      appointments.filter((apt: any) => apt.type === "virtual").map((appointment: any) => (
                        <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Dr. {appointment.doctorId === 1 ? 'Sarah Johnson' : appointment.doctorId === 2 ? 'James Wilson' : appointment.doctorId === 3 ? 'Michael Chen' : 'Emily Rodriguez'}</h4>
                              <p className="text-sm text-gray-500">{new Date(appointment.date).toLocaleDateString()} at {new Date(appointment.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              <p className="text-sm text-gray-500 mt-1">Reason: {appointment.reason}</p>
                            </div>
                            <div>
                              {new Date(appointment.date) > new Date() ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center" 
                                  onClick={() => {
                                    // Find the doctor for this appointment
                                    const doctor = doctors?.find((d: any) => d.id === appointment.doctorId);
                                    if (doctor) {
                                      setSelectedDoctor(doctor);
                                      setOpenConsultDialog(true);
                                    }
                                  }}
                                >
                                  <Video className="h-4 w-4 mr-1.5" />
                                  Join Call
                                </Button>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-600 mb-4">You don't have any upcoming telemedicine appointments</p>
                        <Button onClick={() => navigate("/book-appointment")}>Schedule a Consultation</Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">You don't have any upcoming telemedicine appointments</p>
                    <Button onClick={() => navigate("/book-appointment")}>Schedule a Consultation</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Telemedicine Consultation Dialog */}
        <Dialog open={openConsultDialog} onOpenChange={setOpenConsultDialog}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-0">
              <DialogTitle className="text-xl">
                {isCallActive ? (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span>Active Call with Dr. {selectedDoctor?.id === 1 ? 'Sarah Johnson' : selectedDoctor?.id === 2 ? 'James Wilson' : selectedDoctor?.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}</span>
                  </div>
                ) : (
                  `Consultation with Dr. ${selectedDoctor?.id === 1 ? 'Sarah Johnson' : selectedDoctor?.id === 2 ? 'James Wilson' : selectedDoctor?.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedDoctor && `${selectedDoctor.specialty} - ${selectedDoctor.location}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-6">
              {isCallActive ? (
                <div className="space-y-4">
                  <div className="relative w-full rounded-lg overflow-hidden bg-gray-900 aspect-video">
                    {/* Remote Video (Doctor) */}
                    <div className="w-full h-full flex items-center justify-center">
                      {isCallActive ? (
                        <video
                          ref={remoteVideoRef}
                          className="w-full h-full object-cover"
                          poster="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                          autoPlay
                          playsInline
                        ></video>
                      ) : (
                        <div className="text-white">Connecting...</div>
                      )}
                    </div>
                    
                    {/* Local Video (Patient) */}
                    <div className="absolute bottom-4 right-4 w-1/4 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                      <video
                        ref={localVideoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      ></video>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full h-12 w-12 ${!isMicOn ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700' : ''}`}
                      onClick={toggleMicrophone}
                    >
                      {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full h-12 w-12"
                      onClick={endCall}
                    >
                      <PhoneOff className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full h-12 w-12 ${!isVideoOn ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700' : ''}`}
                      onClick={toggleVideo}
                    >
                      {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedDoctor?.imageUrl} 
                      alt={`Dr. ${selectedDoctor?.id === 1 ? 'Sarah Johnson' : selectedDoctor?.id === 2 ? 'James Wilson' : selectedDoctor?.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">Dr. {selectedDoctor?.id === 1 ? 'Sarah Johnson' : selectedDoctor?.id === 2 ? 'James Wilson' : selectedDoctor?.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}</h3>
                      <p className="text-gray-500">{selectedDoctor?.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-2">Before starting the call, please:</div>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Check that your camera and microphone are working properly
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Ensure you have a stable internet connection
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Find a quiet, private space for your consultation
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label htmlFor="consultation-reason" className="text-sm font-medium text-gray-700 mb-1 block">Reason for Consultation (optional)</Label>
                    <Input 
                      id="consultation-reason" 
                      placeholder="Briefly describe your symptoms or concerns"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="px-6 py-4 bg-gray-50">
              {!isCallActive ? (
                <Button 
                  className="w-full sm:w-auto gap-2" 
                  onClick={startVideoCall}
                >
                  <Phone className="h-4 w-4" />
                  Start Video Call
                </Button>
              ) : (
                <div className="text-xs text-gray-500 w-full text-center">
                  This call is encrypted and secure. Your privacy is protected under HIPAA guidelines.
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Telemedicine;
