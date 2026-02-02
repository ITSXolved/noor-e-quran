import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { getServiceSupabase } from '@/lib/supabase';
import { generateReceipt } from '@/lib/utils';
import type { RegistrationFormData } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body: RegistrationFormData = await request.json();

        // Validate request body
        if (!body.name || !body.email || !body.mobile || !body.gender || !body.city || !body.occupation) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = getServiceSupabase();

        // Create application record in database
        const { data: application, error: dbError } = await supabase
            .from('applications')
            .insert({
                name: body.name,
                gender: body.gender,
                mobile: body.mobile,
                email: body.email,
                city: body.city,
                occupation: body.occupation,
                payment_status: 'pending',
                application_status: 'payment_pending',
            })
            .select()
            .single();

        if (dbError || !application) {
            console.error('Database error:', dbError);
            return NextResponse.json(
                { error: 'Failed to create application' },
                { status: 500 }
            );
        }

        // Create Razorpay order
        const courseFee = parseInt(process.env.NEXT_PUBLIC_COURSE_FEE || '2999');
        const receipt = generateReceipt();

        const razorpayOrder = await createRazorpayOrder(courseFee, receipt);

        // Update application with Razorpay order ID
        const { data: updatedApp, error: updateError } = await supabase
            .from('applications')
            .update({ razorpay_order_id: razorpayOrder.id })
            .eq('id', application.id)
            .select()
            .single();

        if (updateError || !updatedApp) {
            console.error('Failed to update order ID:', updateError);
            return NextResponse.json(
                { error: 'Failed to save order details' },
                { status: 500 }
            );
        }

        console.log('Order created successfully:', {
            orderId: razorpayOrder.id,
            applicationId: application.id,
            referenceNumber: application.reference_number
        });

        return NextResponse.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            applicationId: application.id,
            referenceNumber: application.reference_number,
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
