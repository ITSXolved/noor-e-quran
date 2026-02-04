import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { getServiceSupabase } from '@/lib/supabase';
import { sendUserConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';
import type { PaymentVerificationData } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body: PaymentVerificationData = await request.json();

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, application_id } = body;

        // Verify payment signature
        const isValid = verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Update application with payment details
        // Find application by razorpay_order_id for more reliable lookup
        console.log('Attempting to verify payment for order:', razorpay_order_id);

        const supabase = getServiceSupabase();

        const { data: application, error: updateError } = await supabase
            .from('applications')
            .update({
                razorpay_payment_id,
                razorpay_signature,
                payment_status: 'completed',
                application_status: 'payment_done',
            })
            .eq('razorpay_order_id', razorpay_order_id)
            .select()
            .single();

        if (updateError || !application) {
            console.error('Database update error:', updateError);
            console.error('Attempted to update order:', razorpay_order_id);

            // Check if application exists
            const { data: existingApp } = await supabase
                .from('applications')
                .select('*')
                .eq('razorpay_order_id', razorpay_order_id)
                .single();

            console.log('Existing application:', existingApp);

            return NextResponse.json(
                { error: 'Failed to update payment status' },
                { status: 500 }
            );
        }

        console.log('Payment verified successfully for:', application.reference_number);

        // Send confirmation emails
        try {
            // Send confirmation email to user
            await sendUserConfirmationEmail({
                to: application.email,
                name: application.name,
                referenceNumber: application.reference_number,
            });

            // Send notification email to admin
            await sendAdminNotificationEmail({
                referenceNumber: application.reference_number,
                applicationDetails: {
                    name: application.name,
                    email: application.email,
                    mobile: application.mobile,
                    city: application.city,
                    occupation: application.occupation,
                },
            });

            console.log('Confirmation emails sent successfully');
        } catch (emailError) {
            console.error('Error sending confirmation emails:', emailError);
            // Don't fail the payment verification if email fails
            // The payment is still successful
        }

        return NextResponse.json({
            success: true,
            referenceNumber: application.reference_number,
            application,
        });

    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
