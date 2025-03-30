import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  CalendarCheck, 
  Video, 
  FileText, 
  ChevronRight, 
  Play,
  ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['/api/doctors'],
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-12 md:py-16 lg:py-20 flex flex-col md:flex-row items-center">
            <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Healthcare Made Simple
              </h1>
              <p className="text-xl text-primary-100 mb-6 max-w-lg mx-auto md:mx-0">
                Book appointments, consult with doctors online, and find affordable healthcare options all in one place.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/find-doctors">
                  <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Find a Doctor
                  </Button>
                </Link>
                <Link href="/telemedicine">
                  <Button size="lg">
                    Virtual Consultation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <img 
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Doctor using tablet" 
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-primary-700 transform -skew-x-12 origin-top-right"></div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <CalendarCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment Booking</h3>
              <p className="text-gray-600 mb-4">Schedule in-person or virtual appointments with top doctors in your area.</p>
              <Link href="/book-appointment">
                <a className="mt-auto text-primary hover:text-primary-700 font-medium flex items-center">
                  Book Now <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Video className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Virtual Consultations</h3>
              <p className="text-gray-600 mb-4">Connect with healthcare providers from the comfort of your home.</p>
              <Link href="/telemedicine">
                <a className="mt-auto text-green-600 hover:text-green-700 font-medium flex items-center">
                  Start Consultation <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Insurance Assistance</h3>
              <p className="text-gray-600 mb-4">Get help finding affordable insurance options and government programs.</p>
              <Link href="/insurance-help">
                <a className="mt-auto text-purple-600 hover:text-purple-700 font-medium flex items-center">
                  Explore Options <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">Top Doctors</h2>
          <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Our network includes highly rated healthcare professionals across various specialties
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingDoctors ? (
              <div className="col-span-4 flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              doctors?.slice(0, 4).map((doctor: any) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow overflow-hidden transition duration-300 hover:shadow-lg">
                  <div className="p-5">
                    <div className="flex items-start">
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={doctor.imageUrl}
                        alt={`Dr. ${doctor.name}`}
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{`Dr. ${doctor.id === 1 ? 'Sarah Johnson' : doctor.id === 2 ? 'James Wilson' : doctor.id === 3 ? 'Michael Chen' : 'Emily Rodriguez'}`}</h3>
                        <p className="text-primary">{doctor.specialty}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {doctor.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center mb-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600 text-sm">{doctor.rating} ({doctor.reviewCount} reviews)</span>
                      </div>
                      
                      <div className="border-t border-gray-200 mt-4 pt-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">Next Available:</span>
                          <span className="font-medium text-sm">Today, 2:00 PM</span>
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
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/find-doctors">
              <Button variant="outline" className="gap-2">
                View All Doctors <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Telemedicine Preview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Virtual Care, Real Results</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our telemedicine platform connects you with healthcare professionals from the comfort of your home, providing quality care without the wait.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                      <Video className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">High-Quality Video Consultations</h3>
                    <p className="mt-2 text-gray-600">Connect face-to-face with doctors through our secure, HIPAA-compliant video platform.</p>
                  </div>
                </li>
                <li className="flex">
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
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Comprehensive Care Plans</h3>
                    <p className="mt-2 text-gray-600">Receive detailed treatment plans and follow-up care instructions after your virtual visit.</p>
                  </div>
                </li>
              </ul>
              <div>
                <Link href="/telemedicine">
                  <Button className="gap-2">
                    Try Telemedicine <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 relative">
              <div className="relative mx-auto w-full rounded-lg shadow-lg overflow-hidden">
                <img 
                  className="w-full" 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Doctor having a video consultation with patient"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-75 flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to take control of your healthcare?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of patients who have simplified their healthcare journey with MediConnect.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                Create an Account
              </Button>
            </Link>
            <Link href="/find-doctors">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-primary-800">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
