import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: applicationId } = await params;
        const cookieStore = await cookies();
        const adminSession = cookieStore.get('admin_session');

        if (!adminSession) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { application_status, remark } = await request.json();

        const supabase = getServiceSupabase();

        // Get current application
        const { data: currentApp } = await supabase
            .from('applications')
            .select('application_status')
            .eq('id', applicationId)
            .single();

        // Update application status
        const { data: application, error } = await supabase
            .from('applications')
            .update({ application_status })
            .eq('id', applicationId)
            .select()
            .single();

        if (error) {
            console.error('Error updating application:', error);
            return NextResponse.json(
                { error: 'Failed to update application' },
                { status: 500 }
            );
        }

        // Create status update record
        await supabase.from('status_updates').insert({
            application_id: applicationId,
            old_status: currentApp?.application_status,
            new_status: application_status,
            remark,
            updated_by: adminSession.value,
        });

        return NextResponse.json({ success: true, application });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
