import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { razorpay } from '@/lib/razorpay';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        // Verify admin session
        const cookieStore = await cookies();
        const adminSession = cookieStore.get('admin_session');

        if (!adminSession) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = getServiceSupabase();

        // Fetch all applications that are still payment_pending and have a razorpay_order_id
        const { data: pendingApps, error: fetchError } = await supabase
            .from('applications')
            .select('id, razorpay_order_id, reference_number')
            .eq('application_status', 'payment_pending')
            .not('razorpay_order_id', 'is', null);

        if (fetchError) {
            console.error('Error fetching pending applications:', fetchError);
            return NextResponse.json(
                { error: 'Failed to fetch pending applications' },
                { status: 500 }
            );
        }

        if (!pendingApps || pendingApps.length === 0) {
            return NextResponse.json({
                success: true,
                synced: 0,
                message: 'No pending applications with Razorpay orders to sync',
            });
        }

        let syncedCount = 0;
        const syncedRefs: string[] = [];

        // Check each pending application against Razorpay
        for (const app of pendingApps) {
            try {
                // Fetch the order from Razorpay
                const order = await razorpay.orders.fetch(app.razorpay_order_id);

                if (order.status === 'paid') {
                    // Fetch payments for this order to get the payment_id
                    let paymentId: string | null = null;
                    try {
                        const payments = await razorpay.orders.fetchPayments(app.razorpay_order_id);
                        if (payments && payments.items && payments.items.length > 0) {
                            // Get the most recent captured payment
                            const capturedPayment = payments.items.find(
                                (p: any) => p.status === 'captured'
                            );
                            paymentId = capturedPayment?.id || payments.items[0].id;
                        }
                    } catch (paymentErr) {
                        console.error(`Could not fetch payments for order ${app.razorpay_order_id}:`, paymentErr);
                    }

                    // Update the application in database
                    const updateData: any = {
                        payment_status: 'completed',
                        application_status: 'payment_done',
                    };

                    if (paymentId) {
                        updateData.razorpay_payment_id = paymentId;
                    }

                    const { error: updateError } = await supabase
                        .from('applications')
                        .update(updateData)
                        .eq('id', app.id);

                    if (updateError) {
                        console.error(`Error updating app ${app.reference_number}:`, updateError);
                    } else {
                        syncedCount++;
                        syncedRefs.push(app.reference_number);
                        console.log(`Synced payment for ${app.reference_number}`);
                    }
                }
            } catch (orderErr) {
                console.error(`Error fetching Razorpay order for ${app.reference_number}:`, orderErr);
                // Continue with next application
            }
        }

        return NextResponse.json({
            success: true,
            synced: syncedCount,
            total_checked: pendingApps.length,
            synced_references: syncedRefs,
            message: syncedCount > 0
                ? `${syncedCount} payment(s) synced successfully`
                : 'All payment statuses are already up to date',
        });
    } catch (error) {
        console.error('Error syncing payments:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
