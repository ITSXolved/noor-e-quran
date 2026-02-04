import nodemailer from 'nodemailer';

// Create transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM || 'zyraedtech@gmail.com',
    pass: process.env.EMAIL_PASSWORD, // Gmail App Password
  },
});

interface SendConfirmationEmailParams {
  to: string;
  name: string;
  referenceNumber: string;
  applicationDetails: {
    name: string;
    email: string;
    mobile: string;
    city: string;
    occupation: string;
  };
}

export const sendUserConfirmationEmail = async ({
  to,
  name,
  referenceNumber,
}: Omit<SendConfirmationEmailParams, 'applicationDetails'>) => {
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+91-8128868483';
  const fromEmail = process.env.EMAIL_FROM || 'zyraedtech@gmail.com';
  const supportEmail = process.env.SUPPORT_EMAIL || 'info@zyraedu.com';

  try {
    await transporter.sendMail({
      from: `"Zyra Edutech" <${fromEmail}>`,
      to,
      subject: '🌙 Welcome to Noor-e-Quran | Your Ramadan Journey Begins',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #1a5f3f 0%, #2d8659 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: normal; }
            .moon { font-size: 40px; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .content p { margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; }
            .highlight { background: linear-gradient(135deg, #1a5f3f 0%, #2d8659 100%); color: white; padding: 25px; margin: 30px 0; border-radius: 8px; text-align: center; }
            .reference { font-size: 18px; font-weight: bold; letter-spacing: 1px; }
            .contact { background: #f8f9fa; padding: 20px; border-left: 4px solid #2d8659; margin: 30px 0; }
            .contact p { margin: 5px 0; font-size: 15px; }
            .footer { text-align: center; padding: 30px; background: #f8f9fa; color: #666; }
            .footer p { margin: 5px 0; }
            .tagline { font-style: italic; color: #2d8659; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="moon">🌙</div>
              <h1>Welcome to Noor-e-Quran</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Ramadan Special Signature Course</p>
            </div>
            
            <div class="content">
              <p><strong>Assalamu Alaikum 🌙</strong></p>
              
              <p>Welcome to <strong>Noor-e-Quran</strong> – Ramadan Special Signature Course.</p>
              
              <p>With your enrollment of <strong>₹999</strong>, you haven't just joined a course —<br>
              you've answered a call towards light, discipline, and inner transformation.</p>
              
              <p>Over the next <strong>27 days</strong>, the Quran will not just be read —<br>
              it will be felt, understood, and lived.</p>
              
              <p>You are now part of a selected journey where Ramadan becomes a turning point, not just a month.</p>
              
              <div class="highlight">
                <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Your Reference Number</p>
                <p class="reference">${referenceNumber}</p>
              </div>
              
              <p>📩 Course access details and next steps will be shared with you shortly.</p>
              
              <div class="contact">
                <p><strong>For any assistance or support, feel free to reach us anytime:</strong></p>
                <p>📞 ${supportPhone}</p>
                <p>📧 ${supportEmail}</p>
              </div>
              
              <p>May this Ramadan bring Noor into your heart and direction into your life.</p>
              
              <p><strong>Welcome to the journey. Welcome to the light.</strong></p>
              
              <p style="margin-top: 30px;">Warm regards,<br>
              <strong>Team Zyra Learning</strong><br>
              <span class="tagline">Dil se Zindagi tak</span></p>
            </div>
            
            <div class="footer">
              <p>© 2026 Zyra Edutech. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('User confirmation email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending user confirmation email:', error);
    throw error;
  }
};

export const sendAdminNotificationEmail = async ({
  applicationDetails,
  referenceNumber,
}: Pick<SendConfirmationEmailParams, 'applicationDetails' | 'referenceNumber'>) => {
  const fromEmail = process.env.EMAIL_FROM || 'zyraedtech@gmail.com';
  const adminEmail = process.env.ADMIN_EMAIL || 'zyraedtech@gmail.com';

  try {
    await transporter.sendMail({
      from: `"Zyra Edutech" <${fromEmail}>`,
      to: adminEmail,
      subject: `New Course Registration - ${referenceNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #B946C7 0%, #8B2F9E 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; width: 150px; color: #666; }
            .detail-value { flex: 1; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Course Registration</h2>
            </div>
            <div class="content">
              <p><strong>Reference Number:</strong> ${referenceNumber}</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${applicationDetails.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${applicationDetails.email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Mobile:</span>
                  <span class="detail-value">${applicationDetails.mobile}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">City:</span>
                  <span class="detail-value">${applicationDetails.city}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Occupation:</span>
                  <span class="detail-value">${applicationDetails.occupation}</span>
                </div>
              </div>
              
              <p><strong>Action Required:</strong> Please contact the applicant within 24 hours.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
};
