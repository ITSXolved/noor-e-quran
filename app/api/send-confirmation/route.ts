import { NextRequest, NextResponse } from 'next/server';
import { sendUserConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { applicationId } = await request.json();

        if (!applicationId) {
            return NextResponse.json(
                { error: 'Application ID is required' },
                { status: 400 }
            );
        }

        // Fetch application details
        const { data: application, error } = await supabase
            .from('applications')
            .select('*')
            .eq('id', applicationId)
            .single();

        if (error || !application) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

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

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error sending emails:', error);
        return NextResponse.json(
            { error: 'Failed to send confirmation emails' },
            { status: 500 }
        );
    }
}
