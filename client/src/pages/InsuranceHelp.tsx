import { useState } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { 
  CreditCard, 
  HandHeart, 
  CheckCircle2, 
  CalendarCheck, 
  FileQuestion 
} from "lucide-react";

const InsuranceHelp = () => {
  const [incomeRange, setIncomeRange] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [state, setState] = useState("");

  // Fetch insurance options
  const { data: insuranceOptions, isLoading: isLoadingInsurance } = useQuery({
    queryKey: ['/api/insurance'],
  });

  // Fetch assistance programs
  const { data: assistancePrograms, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['/api/assistance-programs'],
  });

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Insurance & Assistance Programs</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We help you navigate healthcare coverage options to find the best fit for you and your family.
          </p>
        </div>

        <Tabs defaultValue="overview" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insurance">Private Insurance</TabsTrigger>
            <TabsTrigger value="assistance">Government Programs</TabsTrigger>
            <TabsTrigger value="consultation">Get Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Understanding Your Healthcare Options
                </CardTitle>
                <CardDescription>
                  Learn about different types of health coverage and find what's best for your situation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Private Insurance Plans</h3>
                      <p className="text-gray-600 mb-4">
                        We work with most major insurance providers to ensure you get the coverage you need at rates you can afford.
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span className="text-gray-600">Compare multiple insurance plans side-by-side</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span className="text-gray-600">Get personalized recommendations based on your needs</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span className="text-gray-600">Expert guidance throughout the enrollment process</span>
                        </li>
                      </ul>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={() => document.querySelector('[data-value="insurance"]')?.click()}
                      >
                        Explore Insurance Options
                        <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <HandHeart className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Government Assistance Programs</h3>
                      <p className="text-gray-600 mb-4">
                        We help you determine eligibility and apply for government healthcare programs designed to provide affordable coverage.
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span className="text-gray-600">Medicaid application assistance</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span className="text-gray-600">Medicare enrollment guidance</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span className="text-gray-600">Children's Health Insurance Program (CHIP) information</span>
                        </li>
                      </ul>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={() => document.querySelector('[data-value="assistance"]')?.click()}
                      >
                        Check Eligibility
                        <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I know which health insurance plan is right for me?</AccordionTrigger>
                      <AccordionContent>
                        The right plan depends on your specific healthcare needs, budget, and preferences. Consider factors like premium costs, deductibles, network providers, prescription coverage, and any specific health services you regularly use. Our advisors can help you compare options to find the best fit.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>What's the difference between HMO and PPO plans?</AccordionTrigger>
                      <AccordionContent>
                        HMO (Health Maintenance Organization) plans typically require you to choose a primary care physician and get referrals to see specialists. They generally have lower premiums but less flexibility. PPO (Preferred Provider Organization) plans offer more flexibility to see specialists without referrals and often cover out-of-network care, but usually have higher premiums.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Am I eligible for Medicaid or Medicare?</AccordionTrigger>
                      <AccordionContent>
                        Medicaid eligibility is primarily based on income and varies by state. Medicare is generally available to people 65 or older, younger people with disabilities, and people with End-Stage Renal Disease. Our advisors can help determine your eligibility for these programs based on your specific situation.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>What happens if I don't have health insurance?</AccordionTrigger>
                      <AccordionContent>
                        Without health insurance, you'll be responsible for paying all medical costs out of pocket, which can be very expensive for serious illnesses or injuries. While there's no longer a federal tax penalty for not having coverage, some states have their own requirements. More importantly, being uninsured puts you at financial risk and may lead to delayed or inadequate healthcare.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button onClick={() => document.querySelector('[data-value="consultation"]')?.click()}>
                  Schedule a Free Consultation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="insurance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Private Insurance Plans</CardTitle>
                <CardDescription>
                  Compare insurance options to find coverage that fits your healthcare needs and budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingInsurance ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {insuranceOptions?.map((option: any) => (
                        <div key={option.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all">
                          <div className="bg-primary-50 p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg">{option.name}</h3>
                            <p className="text-sm text-gray-500">{option.type} Insurance</p>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-700 mb-4">{option.description}</p>
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Coverage Details</h4>
                                <p className="text-sm text-gray-600">{option.coverageDetails}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                                <p className="text-sm text-gray-600">{option.contactInfo}</p>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <Button size="sm" variant="outline" className="w-full">Request Information</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Understanding Insurance Terms</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <h4 className="font-medium text-gray-900">Premium</h4>
                          <p className="text-sm text-gray-600">The amount you pay for your health insurance every month.</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <h4 className="font-medium text-gray-900">Deductible</h4>
                          <p className="text-sm text-gray-600">The amount you pay for covered health care services before your insurance begins to pay.</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <h4 className="font-medium text-gray-900">Copayment</h4>
                          <p className="text-sm text-gray-600">A fixed amount you pay for a covered health care service, usually when you receive the service.</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <h4 className="font-medium text-gray-900">Coinsurance</h4>
                          <p className="text-sm text-gray-600">Your share of the costs of a covered health care service, calculated as a percentage of the allowed amount.</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <h4 className="font-medium text-gray-900">Out-of-Pocket Maximum</h4>
                          <p className="text-sm text-gray-600">The most you have to pay for covered services in a plan year. After you spend this amount, the plan pays 100% of the cost of covered benefits.</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <h4 className="font-medium text-gray-900">Network</h4>
                          <p className="text-sm text-gray-600">The facilities, providers, and suppliers your health insurer has contracted with to provide health care services.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full md:w-auto">Compare Insurance Plans</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="assistance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Government Assistance Programs</CardTitle>
                <CardDescription>
                  Learn about government healthcare programs and check your eligibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPrograms ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-primary-50 p-4 rounded-lg border border-primary-200 mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Check Your Eligibility</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Answer a few questions to see which government assistance programs you might qualify for.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="income-range" className="text-sm">Household Income Range</Label>
                          <Select value={incomeRange} onValueChange={setIncomeRange}>
                            <SelectTrigger id="income-range" className="w-full">
                              <SelectValue placeholder="Select income range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="under25k">Less than $25,000</SelectItem>
                                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                                <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                                <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                                <SelectItem value="over100k">Over $100,000</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="household-size" className="text-sm">Household Size</Label>
                          <Select value={householdSize} onValueChange={setHouseholdSize}>
                            <SelectTrigger id="household-size" className="w-full">
                              <SelectValue placeholder="Select household size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="1">1 person</SelectItem>
                                <SelectItem value="2">2 people</SelectItem>
                                <SelectItem value="3">3 people</SelectItem>
                                <SelectItem value="4">4 people</SelectItem>
                                <SelectItem value="5+">5+ people</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-sm">State of Residence</Label>
                          <Select value={state} onValueChange={setState}>
                            <SelectTrigger id="state" className="w-full">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Popular States</SelectLabel>
                                <SelectItem value="CA">California</SelectItem>
                                <SelectItem value="NY">New York</SelectItem>
                                <SelectItem value="TX">Texas</SelectItem>
                                <SelectItem value="FL">Florida</SelectItem>
                                <SelectItem value="IL">Illinois</SelectItem>
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>More States</SelectLabel>
                                {/* Additional states would go here */}
                                <SelectItem value="other">Other States</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button>Check Eligibility</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {assistancePrograms?.map((program: any) => (
                        <div key={program.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="p-5">
                            <h3 className="text-xl font-semibold text-gray-900">{program.name}</h3>
                            <p className="text-gray-600 mt-2">{program.description}</p>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <Accordion type="single" collapsible>
                                <AccordionItem value="eligibility">
                                  <AccordionTrigger className="text-sm font-medium">Eligibility Criteria</AccordionTrigger>
                                  <AccordionContent>
                                    <p className="text-sm text-gray-600">{program.eligibilityCriteria}</p>
                                  </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="application">
                                  <AccordionTrigger className="text-sm font-medium">Application Process</AccordionTrigger>
                                  <AccordionContent>
                                    <p className="text-sm text-gray-600">{program.applicationProcess}</p>
                                  </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="contact">
                                  <AccordionTrigger className="text-sm font-medium">Contact Information</AccordionTrigger>
                                  <AccordionContent>
                                    <p className="text-sm text-gray-600">{program.contactInfo}</p>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                          <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                            <Button variant="outline" size="sm" className="mr-2">
                              Learn More
                            </Button>
                            <Button size="sm">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="consultation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Get Personalized Assistance</CardTitle>
                <CardDescription>
                  Schedule a consultation with one of our healthcare insurance advisors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <CalendarCheck className="h-5 w-5 mr-2 text-primary" />
                        How It Works
                      </h3>
                      <ol className="space-y-3 text-gray-600">
                        <li className="flex">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-3 font-medium text-sm">1</span>
                          <span>Fill out the consultation request form with your contact information and insurance needs.</span>
                        </li>
                        <li className="flex">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-3 font-medium text-sm">2</span>
                          <span>One of our insurance advisors will contact you within 24 hours to schedule a consultation.</span>
                        </li>
                        <li className="flex">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-3 font-medium text-sm">3</span>
                          <span>During the consultation, we'll discuss your healthcare needs and budget to find the best options.</span>
                        </li>
                        <li className="flex">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-3 font-medium text-sm">4</span>
                          <span>We'll help you understand and apply for the insurance or assistance programs that best fit your situation.</span>
                        </li>
                      </ol>
                    </div>
                    
                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FileQuestion className="h-5 w-5 mr-2 text-primary" />
                        What to Prepare
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Information about your current insurance (if any)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>List of current medications and healthcare providers</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Estimated annual household income</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Any specific healthcare needs or concerns</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Request a Consultation</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="john.doe@example.com" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" placeholder="(123) 456-7890" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="insurance-type">What type of insurance are you interested in?</Label>
                          <Select>
                            <SelectTrigger id="insurance-type">
                              <SelectValue placeholder="Select insurance type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Private Health Insurance</SelectItem>
                              <SelectItem value="medicare">Medicare</SelectItem>
                              <SelectItem value="medicaid">Medicaid</SelectItem>
                              <SelectItem value="chip">Children's Health Insurance Program (CHIP)</SelectItem>
                              <SelectItem value="not-sure">Not sure / Need guidance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Additional Information</Label>
                          <Textarea 
                            id="message" 
                            placeholder="Please share any specific questions or concerns you have about healthcare coverage."
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="terms" />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              I agree to the terms and privacy policy
                            </label>
                            <p className="text-xs text-gray-500">
                              Your information will only be used to contact you about insurance options.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-6">Submit Request</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 text-center">
          <Link href="/book-appointment">
            <Button size="lg" className="px-8">
              Schedule a Consultation <CalendarCheck className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InsuranceHelp;
