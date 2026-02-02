import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const supabase = getServiceSupabase();

        // Fetch all applications
        const { data: applications, error } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching applications:', error);
            return NextResponse.json(
                { error: 'Failed to fetch applications' },
                { status: 500 }
            );
        }

        // Calculate analytics
        const analytics = {
            total: applications.length,
            paymentPending: applications.filter(app => app.application_status === 'payment_pending').length,
            paymentDone: applications.filter(app => app.application_status === 'payment_done').length,
            addedToCourse: applications.filter(app => app.application_status === 'added_to_course').length,
        };

        return NextResponse.json({ applications, analytics });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
