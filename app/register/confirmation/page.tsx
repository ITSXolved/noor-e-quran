'use client';

import { CheckCircle, Phone, Mail, Home } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const referenceNumber = searchParams.get('ref') || 'N/A';
    const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+91-1234567890';

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <Card className="animate-slide-up">
                    <CardContent className="p-8 md:p-12">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse-slow">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Welcome to Zyra Edutech! 🎉
                            </h1>
                            <p className="text-lg text-gray-600 mb-2">
                                Thank you for registering with us
                            </p>
                            <p className="text-md text-primary font-semibold">
                                Your payment has been successfully processed
                            </p>
                        </div>

                        {/* Reference Number */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border-2 border-primary/20">
                            <p className="text-sm text-gray-600 text-center mb-2">Your Reference Number</p>
                            <p className="text-3xl font-bold text-primary text-center tracking-wider">
                                {referenceNumber}
                            </p>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                Please save this number for future reference
                            </p>
                        </div>

                        {/* Important Notice */}
                        <div className="bg-gradient-zyra rounded-lg p-6 mb-6 text-white">
                            <div className="flex items-center justify-center mb-3">
                                <CheckCircle className="w-6 h-6 mr-2" />
                                <h3 className="font-bold text-lg">Important Notice</h3>
                            </div>
                            <p className="text-center text-white/95 text-lg leading-relaxed">
                                Our customer care team will reach out to you within <strong className="text-white font-bold">24 hours</strong> to complete your registration process.
                            </p>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h2>
                            <div className="space-y-3 text-gray-700">
                                <p className="flex items-start">
                                    <span className="text-primary font-bold mr-2">✓</span>
                                    <span>
                                        You will receive a confirmation email with your registration details
                                    </span>
                                </p>
                                <p className="flex items-start">
                                    <span className="text-primary font-bold mr-2">✓</span>
                                    <span>
                                        Our team will contact you on your registered mobile number
                                    </span>
                                </p>
                                <p className="flex items-start">
                                    <span className="text-primary font-bold mr-2">✓</span>
                                    <span>
                                        You will be added to the course group after verification
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gradient-zyra rounded-lg p-6 mb-8 text-white">
                            <h3 className="font-semibold mb-4 text-center">Need Help? Contact Us</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-center space-x-3">
                                    <Phone className="w-5 h-5" />
                                    <span>{supportPhone}</span>
                                </div>
                                <div className="flex items-center justify-center space-x-3">
                                    <Mail className="w-5 h-5" />
                                    <span>info@zyraedu.com</span>
                                </div>
                            </div>
                        </div>


                        {/* Action Buttons */}
                        <div className="flex justify-center">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto px-8"
                                onClick={() => window.print()}
                            >
                                Print Confirmation
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
