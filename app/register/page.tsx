'use client';

import { useState, useEffect } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export default function RegisterPage() {
    const courseFee = process.env.NEXT_PUBLIC_COURSE_FEE || '999';
    const [timeLeft, setTimeLeft] = useState(9 * 60 + 59); // 9:59 in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Registration Card */}
                <Card className="animate-slide-up">
                    <CardHeader className="bg-gradient-zyra text-white">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2">Course Registration</h1>
                            <p className="text-purple-100">
                                Fill in your details to register for the course
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        {/* Countdown Timer */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-6 border-2 border-red-200">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-red-700 mb-2">
                                    ⏰ Limited Time Offer Expires In:
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                                        <span className="text-3xl font-bold text-red-600">
                                            {String(minutes).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs text-gray-600 block">MIN</span>
                                    </div>
                                    <span className="text-2xl font-bold text-red-600">:</span>
                                    <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                                        <span className="text-3xl font-bold text-red-600">
                                            {String(seconds).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs text-gray-600 block">SEC</span>
                                    </div>
                                </div>
                                {timeLeft === 0 && (
                                    <p className="text-sm font-semibold text-red-700 mt-2">
                                        ⚠️ Offer Expired! Price will revert to ₹3899
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Course Fee Display */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-100">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium">Course Fee:</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-primary">₹{courseFee}</span>
                                    <span className="text-lg text-gray-400 line-through">₹3899</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 text-right mt-1">Save ₹2,900 • Limited Time Offer</p>
                        </div>

                        {/* Registration Form */}
                        <RegistrationForm />
                    </CardContent>
                </Card>

                {/* Info Section */}
                <div className="mt-6 bg-white rounded-lg p-6 shadow-md">
                    <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="text-primary mr-2">1.</span>
                            <span>Complete the payment securely through Razorpay</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2">2.</span>
                            <span>Receive a confirmation email with your reference number</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2">3.</span>
                            <span>Our team will contact you within 24 hours to complete enrollment</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
