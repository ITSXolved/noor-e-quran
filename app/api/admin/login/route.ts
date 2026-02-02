import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const supabase = getServiceSupabase();

        // Fetch admin user
        const { data: admin, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !admin) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password_hash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session (simplified - in production, use proper JWT or session management)
        const response = NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                email: admin.email,
            },
        });

        // Set HTTP-only cookie
        response.cookies.set('admin_session', admin.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
