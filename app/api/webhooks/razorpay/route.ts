import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServiceSupabase } from '@/lib/supabase';

// Disable body parsing — we need the raw body for signature verification
export const runtime = 'nodejs';

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    return expectedSignature === signature;
}

export async function POST(request: NextRequest) {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
            return NextResponse.json(
                { error: 'Webhook not configured' },
                { status: 500 }
            );
        }

        // Get the raw body and signature
        const rawBody = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

        if (!isValid) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Parse the verified body
        const event = JSON.parse(rawBody);
        const eventType = event.event;

        console.log('Razorpay webhook received:', eventType);

        const supabase = getServiceSupabase();

        if (eventType === 'payment.captured') {
            const payment = event.payload.payment.entity;
            const orderId = payment.order_id;
            const paymentId = payment.id;

            if (!orderId) {
                console.error('Webhook payment.captured missing order_id');
                return NextResponse.json({ status: 'ok' });
            }

            // Update the application — only if still pending
            const { data, error } = await supabase
                .from('applications')
                .update({
                    razorpay_payment_id: paymentId,
                    payment_status: 'completed',
                    application_status: 'payment_done',
                })
                .eq('razorpay_order_id', orderId)
                .eq('application_status', 'payment_pending')
                .select('id, reference_number')
                .maybeSingle();

            if (error) {
                console.error('Webhook DB update error:', error);
                return NextResponse.json(
                    { error: 'Database update failed' },
                    { status: 500 }
                );
            }

            if (data) {
                console.log(`Webhook: Payment captured for ${data.reference_number} (order: ${orderId})`);
            } else {
                console.log(`Webhook: Order ${orderId} already processed or not found`);
            }
        } else if (eventType === 'payment.failed') {
            const payment = event.payload.payment.entity;
            const orderId = payment.order_id;

            if (orderId) {
                const { error } = await supabase
                    .from('applications')
                    .update({
                        payment_status: 'failed',
                    })
                    .eq('razorpay_order_id', orderId)
                    .eq('application_status', 'payment_pending');

                if (error) {
                    console.error('Webhook DB update error (payment.failed):', error);
                }

                console.log(`Webhook: Payment failed for order ${orderId}`);
            }
        }

        // Always return 200 to Razorpay to acknowledge receipt
        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        // Return 200 even on error to prevent Razorpay from retrying indefinitely
        // for parsing/logic errors. Real errors (DB) are handled above.
        return NextResponse.json({ status: 'ok' });
    }
}
