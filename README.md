# Zyra Edutech - Course Promotion Portal

A modern, full-stack course registration portal built with Next.js, Supabase, and Razorpay integration.

## Features

### Public Features
- 🎨 **Beautiful Landing Page** - Modern UI with Zyra Learning branding
- 📝 **Registration Form** - Comprehensive form with validation
- 💳 **Razorpay Payment** - Secure payment gateway integration
- ✅ **Confirmation Page** - Success page with reference number
- 📧 **Email Notifications** - Automated emails to users and admin

### Admin Features
- 🔐 **Secure Login** - Admin authentication system
- 📊 **Analytics Dashboard** - Real-time statistics and insights
- 📋 **Applications Management** - View and filter all applications
- 🔄 **Status Updates** - Update application status with remarks
- 🔍 **Search & Filter** - Find applications quickly
- 📝 **Audit Trail** - Track all status changes

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Database:** Supabase (PostgreSQL)
- **Payment:** Razorpay
- **Email:** Resend
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Razorpay account
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   cd course-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay key ID
   - `RAZORPAY_KEY_SECRET` - Razorpay secret key
   - `RESEND_API_KEY` - Resend API key
   - `EMAIL_FROM` - Sender email (zyraedtech@gmail.com)

4. **Set up Supabase database**
   
   Run the SQL schema in your Supabase SQL Editor:
   ```bash
   # Copy contents of supabase/schema.sql and execute in Supabase SQL Editor
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Execute the SQL to create tables, functions, and policies

The schema includes:
- `applications` - Store registration data
- `admin_users` - Admin authentication
- `status_updates` - Audit trail for status changes
- RLS policies for security
- Auto-generated reference numbers

## Admin Access

Default admin credentials (change in production):
- Email: `admin@zyraedu.com`
- Password: `admin123`

To create a new admin user, hash the password with bcrypt and insert into `admin_users` table.

## Payment Integration

### Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com)
2. Get your API keys from the dashboard
3. Add keys to `.env.local`
4. For testing, use Razorpay test mode
5. For production, activate your account and use live keys

### Test Cards

In test mode, use these test cards:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Email Configuration

### Resend Setup

1. Sign up at [Resend](https://resend.com)
2. Verify your domain or use their test domain
3. Get your API key
4. Add to `.env.local`

Emails are sent:
- To user: Confirmation with reference number
- To admin: Notification with applicant details

## Project Structure

```
course-portal/
├── app/
│   ├── api/              # API routes
│   │   ├── payment/      # Payment endpoints
│   │   ├── admin/        # Admin endpoints
│   │   └── send-confirmation/
│   ├── admin/            # Admin pages
│   │   ├── login/
│   │   └── dashboard/
│   ├── register/         # Registration pages
│   │   └── confirmation/
│   ├── layout.tsx
│   ├── page.tsx          # Landing page
│   └── globals.css
├── components/
│   ├── ui/               # Reusable UI components
│   └── RegistrationForm.tsx
├── lib/
│   ├── supabase.ts       # Supabase client
│   ├── razorpay.ts       # Razorpay integration
│   ├── email.ts          # Email service
│   └── utils.ts          # Utility functions
├── types/
│   └── index.ts          # TypeScript types
├── supabase/
│   └── schema.sql        # Database schema
└── package.json
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Production

Make sure to set all environment variables in your hosting platform:
- Use production Supabase credentials
- Use live Razorpay keys
- Configure proper email domain

## Features Walkthrough

### User Registration Flow

1. User visits landing page
2. Clicks "Register Now"
3. Fills registration form
4. Proceeds to payment (Razorpay)
5. Completes payment
6. Sees confirmation page with reference number
7. Receives confirmation email

### Admin Workflow

1. Admin logs in at `/admin/login`
2. Views dashboard with analytics
3. Sees all applications in table
4. Filters by status or searches
5. Updates status from "Payment Done" to "Added to Course"
6. Adds remark about the call
7. Application updated with audit trail

## Security

- Row Level Security (RLS) enabled on all tables
- Admin authentication with bcrypt password hashing
- HTTP-only cookies for sessions
- Environment variables for sensitive data
- CORS and CSRF protection

## Support

For issues or questions:
- Email: zyraedtech@gmail.com
- Phone: [Your support number]

## License

© 2026 Zyra Edutech. All rights reserved.
