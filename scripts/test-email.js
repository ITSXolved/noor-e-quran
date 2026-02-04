// Test script to verify Gmail SMTP email configuration
// Run with: node scripts/test-email.js

require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('🔍 Testing Gmail SMTP Configuration...\n');

    // Check environment variables
    console.log('Environment Variables:');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '❌ NOT SET');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
    console.log('');

    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
        console.error('❌ Error: EMAIL_FROM or EMAIL_PASSWORD not set in .env.local');
        process.exit(1);
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        // Verify connection
        console.log('📡 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');

        // Send test email
        console.log('📧 Sending test email...');
        const info = await transporter.sendMail({
            from: `"Zyra Edutech Test" <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_FROM, // Send to yourself for testing
            subject: 'Test Email - Noor-E-Quran Portal',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #B946C7;">✅ Email Configuration Successful!</h2>
                    <p>This is a test email from your Noor-E-Quran course portal.</p>
                    <p>If you received this email, your Gmail SMTP configuration is working correctly!</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                </div>
            `,
        });

        console.log('✅ Test email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log('\n🎉 Email configuration is working! Check your inbox.');

    } catch (error) {
        console.error('\n❌ Error:', error.message);

        if (error.code === 'EAUTH') {
            console.error('\n⚠️  Authentication failed. This usually means:');
            console.error('   1. The EMAIL_PASSWORD is incorrect');
            console.error('   2. You need to generate a Gmail App Password');
            console.error('   3. 2-Factor Authentication is not enabled on your Gmail account');
            console.error('\n📖 Please follow the instructions in GMAIL_SETUP.md');
        }

        process.exit(1);
    }
}

testEmail();
