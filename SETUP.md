# Setup Guide - Zyra Edutech Course Portal

This guide will walk you through setting up the course promotion portal from scratch.

## Step 1: Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `zyra-course-portal`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created

### Get Supabase Credentials

1. Go to Project Settings → API
2. Copy these values to your `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. Verify tables are created in Table Editor

## Step 2: Razorpay Setup

### Create Razorpay Account

1. Go to [razorpay.com](https://razorpay.com) and sign up
2. Complete KYC verification (for production)
3. For testing, you can use test mode immediately

### Get API Keys

1. Go to Settings → API Keys
2. Generate Test Keys (or Live Keys for production)
3. Copy to `.env.local`:
   - Key ID → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET`

### Configure Webhooks (Optional)

1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`

## Step 3: Email Setup (Resend)

### Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address

### Add Domain (Production)

1. Go to Domains → Add Domain
2. Add `zyraedu.com`
3. Add DNS records as shown
4. Wait for verification

### For Testing

1. Use the default test domain: `onboarding@resend.dev`
2. Emails will be sent but may go to spam

### Get API Key

1. Go to API Keys
2. Create new API key
3. Copy to `.env.local`:
   - API Key → `RESEND_API_KEY`

### Configure Sender Email

In `.env.local`:
```
EMAIL_FROM=zyraedtech@gmail.com
```

Note: For production, use a verified domain email.

## Step 4: Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Email (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=zyraedtech@gmail.com

# App Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_COURSE_FEE=2999
NEXT_PUBLIC_SUPPORT_PHONE=+91-1234567890

# Admin (will be set in database)
ADMIN_EMAIL=admin@zyraedu.com
```

## Step 5: Create Admin User

### Generate Password Hash

Run this Node.js script to generate a bcrypt hash:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-secure-password';
const hash = bcrypt.hashSync(password, 10);
console.log('Password hash:', hash);
```

Or use the provided script:
```bash
node scripts/hash-password.js your-secure-password
```

### Insert Admin User

In Supabase SQL Editor, run:

```sql
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@zyraedu.com', 'your-bcrypt-hash-here');
```

## Step 6: Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

## Step 7: Test the Application

### Test Registration Flow

1. Go to `http://localhost:3000`
2. Click "Register Now"
3. Fill in the form with test data
4. Use Razorpay test card:
   - Card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: 12/25
5. Complete payment
6. Verify confirmation page shows
7. Check email inbox for confirmation

### Test Admin Dashboard

1. Go to `http://localhost:3000/admin/login`
2. Login with admin credentials
3. Verify dashboard shows the test application
4. Try filtering and searching
5. Update status to "Added to Course"
6. Add a remark
7. Verify update is saved

## Step 8: Production Deployment

### Prepare for Production

1. **Update Environment Variables:**
   - Use production Supabase credentials
   - Use live Razorpay keys
   - Use verified email domain
   - Update `NEXT_PUBLIC_SITE_URL`

2. **Security Checklist:**
   - Change admin password
   - Enable RLS policies
   - Set up proper CORS
   - Configure rate limiting

3. **Test Payment Flow:**
   - Use real payment methods
   - Verify webhook handling
   - Test refund scenarios

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add all environment variables
5. Deploy

### Post-Deployment

1. Test all features in production
2. Monitor error logs
3. Set up analytics
4. Configure domain (zyraedu.com)

## Troubleshooting

### Common Issues

**Database Connection Error:**
- Verify Supabase credentials
- Check RLS policies are set correctly
- Ensure service role key is used for admin operations

**Payment Not Working:**
- Verify Razorpay keys are correct
- Check if using test/live mode correctly
- Ensure webhook URL is accessible

**Emails Not Sending:**
- Verify Resend API key
- Check sender email is verified
- Look for errors in API logs

**Admin Login Failed:**
- Verify admin user exists in database
- Check password hash is correct
- Clear browser cookies

## Support

Need help? Contact:
- Email: zyraedtech@gmail.com
- Documentation: See README.md

## Next Steps

- Customize branding and colors
- Add more course details
- Set up analytics tracking
- Configure backup systems
- Add more admin features
