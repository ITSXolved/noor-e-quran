'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { RegistrationFormData } from '@/types';

const registrationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    gender: z.enum(['Male', 'Female', 'Other']),
    mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
    email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
    city: z.string().min(2, 'City must be at least 2 characters'),
    occupation: z.enum(['Professional', 'Housewife', 'Business', 'Student']),
});

type FormData = z.infer<typeof registrationSchema>;

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function RegistrationForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(registrationSchema),
    });

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            setError(null);

            // Create order
            const orderResponse = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();

            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load payment gateway');
            }

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Zyra Edutech',
                description: 'Course Registration Fee',
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                application_id: orderData.applicationId,
                            }),
                        });

                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

                        const verifyData = await verifyResponse.json();

                        // Send confirmation emails
                        await fetch('/api/send-confirmation', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ applicationId: orderData.applicationId }),
                        });

                        // Redirect to confirmation page
                        router.push(`/register/confirmation?ref=${verifyData.referenceNumber}&name=${encodeURIComponent(data.name)}`);
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        setError('Payment verification failed. Please contact support.');
                        setIsLoading(false);
                    }
                },
                prefill: {
                    name: data.name,
                    email: data.email,
                    contact: data.mobile,
                },
                theme: {
                    color: '#B946C7',
                },
                modal: {
                    ondismiss: function () {
                        setIsLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred during registration. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <Input
                label="Full Name"
                {...register('name')}
                error={errors.name?.message}
                placeholder="Enter your full name"
                required
            />

            <Select
                label="Gender"
                {...register('gender')}
                error={errors.gender?.message}
                options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' },
                ]}
                required
            />

            <Input
                label="Mobile Number"
                {...register('mobile')}
                error={errors.mobile?.message}
                placeholder="10-digit mobile number"
                type="tel"
                required
            />

            <Input
                label="Email Address"
                {...register('email')}
                error={errors.email?.message}
                placeholder="your.email@example.com (optional)"
                type="email"
            />

            <Input
                label="City"
                {...register('city')}
                error={errors.city?.message}
                placeholder="Enter your city"
                required
            />

            <Select
                label="Occupation"
                {...register('occupation')}
                error={errors.occupation?.message}
                options={[
                    { value: 'Professional', label: 'Professional' },
                    { value: 'Housewife', label: 'Housewife' },
                    { value: 'Business', label: 'Business' },
                    { value: 'Student', label: 'Student' },
                ]}
                required
            />

            <div className="pt-4">
                <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                    {isLoading ? 'Processing...' : 'Proceed'}
                </Button>
            </div>

            <p className="text-sm text-gray-600 text-center">
                By proceeding, you agree to our terms and conditions
            </p>
        </form>
    );
}
