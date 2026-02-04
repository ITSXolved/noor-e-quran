# Gmail App Password Setup Guide

## Step 1: Enable 2-Factor Authentication on Gmail

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click on **2-Step Verification**
4. Follow the prompts to enable 2-Step Verification if not already enabled

## Step 2: Generate an App Password

1. After enabling 2-Step Verification, go back to **Security**
2. Under "Signing in to Google", click on **App passwords**
3. You may need to sign in again
4. Select **Mail** as the app
5. Select **Other (Custom name)** as the device
6. Enter "Noor-E-Quran Portal" as the name
7. Click **Generate**
8. Google will show you a 16-character password (like: `abcd efgh ijkl mnop`)
9. **Copy this password** - you won't be able to see it again!

## Step 3: Update Your .env.local File

Add the following to your `.env.local` file:

```env
# Email Configuration (Gmail SMTP)
EMAIL_FROM=zyraedtech@gmail.com
EMAIL_PASSWORD=your-16-character-app-password-here
```

**Important:** 
- Remove any spaces from the app password when pasting it
- Do NOT use your regular Gmail password - use the App Password generated in Step 2
- Keep this password secure and never commit it to version control

## Step 4: Test the Email

After updating the `.env.local` file:

1. Restart your development server
2. Make a test payment
3. Check if the welcome email is received

## Troubleshooting

If emails still don't send:

1. **Check the console logs** - Look for error messages in the terminal
2. **Verify credentials** - Make sure the email and app password are correct
3. **Check Gmail settings** - Ensure "Less secure app access" is not blocking the connection
4. **Firewall/Network** - Some networks block SMTP ports (587, 465)

## Security Notes

- App passwords bypass 2-Step Verification for the specific app
- You can revoke app passwords anytime from your Google Account settings
- Each app should have its own unique app password
- Never share your app password
