import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, StarHalf } from "lucide-react";

const FindDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [location, setLocation] = useState("all");

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['/api/doctors'],
  });

  const filteredDoctors = doctors?.filter((doctor: any) => {
    const matchesSearch = doctor.id === 1 ? 
      "Sarah Johnson".toLowerCase().includes(searchTerm.toLowerCase()) : 
      doctor.id === 2 ? 
      "James Wilson".toLowerCase().includes(searchTerm.toLowerCase()) :
      doctor.id === 3 ?
      "Michael Chen".toLowerCase().includes(searchTerm.toLowerCase()) :
      "Emily Rodriguez".toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialty === "all" || doctor.specialty === specialty;
    const matchesLocation = location === "all" || doctor.location.includes(location);
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">Find a Doctor</h1>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Search our network of certified healthcare professionals to find the right doctor for your needs.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Input
                type="text"
                placeholder="Search doctor name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                  <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                  <SelectItem value="Chicago">Chicago</SelectItem>
                  <SelectItem value="Houston">Houston</SelectItem>
                  <SelectItem value="Phoenix">Phoenix</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredDoctors?.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredDoctors?.map((doctor: any) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow overflow-hidden transition duration-300 hover:shadow-lg">
                <div className="p-6">
                  <div className="flex items-start">
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={doctor.imageUrl}
                      alt={`Dr. ${doctor.name}`}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{`Dr. ${doctor.id === 1 ? 'Sarah Johnson' : doctor.id === 2 ? 'James Wilson' : doctor.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</h3>
                      <p className="text-primary">{doctor.specialty}</p>
                      <p className="text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" /> {doctor.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center mb-1">
                      <div className="flex text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        {Number(doctor.rating) >= 5 ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <StarHalf className="h-4 w-4 fill-current" />
                        )}
                      </div>
                      <span className="ml-2 text-gray-600 text-sm">{doctor.rating} ({doctor.reviewCount} reviews)</span>
                    </div>
                    
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">Next Available:</span>
                        <span className="font-medium text-sm">{doctor.id === 1 ? 'Today, 2:00 PM' : doctor.id === 2 ? 'Tomorrow, 10:30 AM' : doctor.id === 3 ? 'Friday, 3:15 PM' : 'Tomorrow, 1:45 PM'}</span>
                      </div>
                      <Link href={`/book-appointment/${doctor.id}`}>
                        <Button className="mt-3 w-full">
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FindDoctors;
