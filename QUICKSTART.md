# Quick Start Guide - Zyra Edutech Portal

## 🚀 Get Started in 5 Steps

### Step 1: Install Dependencies
```bash
cd course-portal
npm install
```

### Step 2: Set Up Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and paste contents of `supabase/schema.sql`
4. Execute the SQL

### Step 3: Configure Environment
1. Copy `.env.example` to `.env.local`
2. Fill in your credentials:
   - Supabase URL and keys
   - Razorpay keys (get from razorpay.com)
   - Resend API key (get from resend.com)

### Step 4: Create Admin User
```bash
# Generate password hash
node scripts/hash-password.js YourSecurePassword123

# Copy the hash and run this in Supabase SQL Editor:
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@zyraedu.com', 'paste-hash-here');
```

### Step 5: Run the App
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📋 What You Get

### Public Pages
- `/` - Landing page
- `/register` - Registration form
- `/register/confirmation` - Success page

### Admin Pages
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard with analytics

## 🔑 Default Admin Login
- Email: `admin@zyraedu.com`
- Password: (the one you set in Step 4)

## 💳 Test Payment
Use Razorpay test card:
- Card: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date

## 📧 Email Setup
For testing, Resend provides a test domain. For production:
1. Add your domain in Resend
2. Verify DNS records
3. Update `EMAIL_FROM` in `.env.local`

## 🎨 Customization

### Change Course Fee
In `.env.local`:
```
NEXT_PUBLIC_COURSE_FEE=2999
```

### Change Support Phone
In `.env.local`:
```
NEXT_PUBLIC_SUPPORT_PHONE=+91-1234567890
```

### Customize Colors
Edit `tailwind.config.ts` - look for `zyra` colors

## 🚢 Deploy to Production

### Vercel (Recommended)
1. Push code to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production
- Use **live** Razorpay keys
- Use **production** Supabase credentials
- Set `NEXT_PUBLIC_SITE_URL` to your domain
- Verify email domain in Resend

## 📞 Need Help?

See detailed guides:
- `README.md` - Full documentation
- `SETUP.md` - Step-by-step setup
- `supabase/schema.sql` - Database structure

## ✅ Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] Admin user created
- [ ] Razorpay account set up
- [ ] Resend account set up
- [ ] App running locally
- [ ] Test registration completed
- [ ] Admin dashboard accessed
- [ ] Ready for deployment!
