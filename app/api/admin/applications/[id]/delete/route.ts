import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin authentication
        const cookieStore = await cookies();
        const adminSession = cookieStore.get('admin_session');

        console.log('Delete request - Admin session:', adminSession ? 'Found' : 'Not found');
        console.log('All cookies:', cookieStore.getAll().map(c => c.name));

        if (!adminSession) {
            console.error('Delete failed: No admin session cookie found');
            return NextResponse.json(
                { error: 'Unauthorized - Please log in again' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const supabase = getServiceSupabase();

        // First, check if the application exists and get its status
        const { data: application, error: fetchError } = await supabase
            .from('applications')
            .select('id, payment_status, application_status, reference_number')
            .eq('id', id)
            .single();

        if (fetchError || !application) {
            console.error('Application not found:', fetchError);
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        // Delete the application
        const { error: deleteError } = await supabase
            .from('applications')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting application:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete application' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Application ${application.reference_number} deleted successfully`,
        });

    } catch (error) {
        console.error('Error in delete endpoint:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
