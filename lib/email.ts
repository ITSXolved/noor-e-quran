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
      subject: 'Registration Confirmation - Zyra Edutech',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #B946C7 0%, #8B2F9E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reference { background: white; padding: 20px; border-left: 4px solid #B946C7; margin: 20px 0; }
            .reference-number { font-size: 24px; font-weight: bold; color: #B946C7; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Successful!</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for registering with Zyra Edutech! We have received your payment successfully.</p>
              
              <div class="reference">
                <p style="margin: 0; font-size: 14px; color: #666;">Your Reference Number:</p>
                <p class="reference-number">${referenceNumber}</p>
              </div>
              
              <p><strong>What's Next?</strong></p>
              <p>Our customer care team will reach out to you within 24 hours to complete your enrollment process.</p>
              
              <p><strong>Contact Information:</strong></p>
              <p>Phone: ${supportPhone}<br>
              Email: ${supportEmail}</p>
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>
              <strong>Zyra Edutech Team</strong></p>
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
