// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// AWS SES SMTP Configuration
const AWS_SMTP_HOST = process.env.AWS_SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com';
const AWS_SMTP_PORT = process.env.AWS_SMTP_PORT || 587;
const AWS_SMTP_USER = process.env.AWS_SMTP_USER;
const AWS_SMTP_PASSWORD = process.env.AWS_SMTP_PASSWORD;
const AWS_SENDER_EMAIL = process.env.AWS_SENDER_EMAIL; // Must be verified in SES

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, company, phone, service, message } = body;

        // Create transporter using AWS SES SMTP
        const transporter = nodemailer.createTransport({
            host: AWS_SMTP_HOST,
            port: AWS_SMTP_PORT,
            secure: false, // Use TLS
            auth: {
                user: AWS_SMTP_USER,
                pass: AWS_SMTP_PASSWORD,
            },
        });

        // Prepare email options
        const mailOptions = {
            from: `ANVITHA Contact Form <${AWS_SENDER_EMAIL}>`,
            to: [
                'info@anvithainfotech.com',
                'sreejesh@luminartechnolab.com',
                'aamirnihan200@gmail.com',
                'rahul@luminartechnolab.com'
            ],
            replyTo: email,
            subject: `New Lead: ${service} Inquiry from ${name}`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6; 
                color: #1a1a1a;
                background: #f5f5f5;
                padding: 20px;
              }
              .email-wrapper { 
                max-width: 650px; 
                margin: 0 auto; 
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
              }
              .header { 
                background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                color: #ffffff; 
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 { 
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                letter-spacing: 1px;
              }
              .header p {
                font-size: 14px;
                color: #a0a0a0;
                font-weight: 400;
              }
              .alert-badge {
                display: inline-block;
                background: #10b981;
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                margin-top: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .content { 
                padding: 35px 30px;
                background: #ffffff;
              }
              .intro {
                font-size: 15px;
                color: #4b5563;
                margin-bottom: 30px;
                padding-bottom: 25px;
                border-bottom: 2px solid #f3f4f6;
              }
              .section-title {
                font-size: 13px;
                font-weight: 700;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #e5e7eb;
              }
              .field-group {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 18px;
                margin-bottom: 20px;
              }
              .field { 
                padding: 18px;
                background: #f9fafb;
                border-radius: 8px;
                border-left: 3px solid #000000;
                transition: all 0.2s ease;
              }
              .field:hover {
                background: #f3f4f6;
                transform: translateX(2px);
              }
              .label { 
                font-weight: 600;
                color: #374151;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 6px;
              }
              .value { 
                color: #111827;
                font-size: 15px;
                word-break: break-word;
              }
              .message-field {
                grid-column: 1 / -1;
              }
              .message-field .value {
                line-height: 1.7;
                white-space: pre-wrap;
              }
              .service-badge {
                display: inline-block;
                background: #000000;
                color: #ffffff;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
              }
              .footer {
                background: #f9fafb;
                padding: 25px 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
              }
              .footer p {
                color: #6b7280;
                font-size: 13px;
                margin-bottom: 8px;
              }
              .footer-links {
                margin-top: 12px;
              }
              .footer-links a {
                color: #000000;
                text-decoration: none;
                font-weight: 600;
                font-size: 13px;
                margin: 0 10px;
              }
              @media only screen and (max-width: 600px) {
                .email-wrapper { border-radius: 0; }
                .header { padding: 30px 20px; }
                .content { padding: 25px 20px; }
                .field-group { grid-template-columns: 1fr; }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="header">
                <h1>ANVITHA INFOTECH</h1>
                <p>Contact Form Submission</p>
                <div class="alert-badge">🔔 New Inquiry</div>
              </div>
              
              <div class="content">
                <div class="intro">
                  You have received a new inquiry through your website contact form. Please review the details below and respond promptly.
                </div>

                <div class="section-title">Contact Information</div>
                <div class="field-group">
                  <div class="field">
                    <div class="label">👤 Full Name</div>
                    <div class="value">${name}</div>
                  </div>
                  <div class="field">
                    <div class="label">📧 Email Address</div>
                    <div class="value">${email}</div>
                  </div>
                  ${company ? `
                  <div class="field">
                    <div class="label">🏢 Company</div>
                    <div class="value">${company}</div>
                  </div>
                  ` : ''}
                  ${phone ? `
                  <div class="field">
                    <div class="label">📱 Phone Number</div>
                    <div class="value">${phone}</div>
                  </div>
                  ` : ''}
                </div>

                <div class="section-title">Service Request</div>
                <div class="field-group">
                  <div class="field">
                    <div class="label">💼 Service Category</div>
                    <div class="value">
                      <span class="service-badge">${service}</span>
                    </div>
                  </div>
                </div>

                <div class="section-title">Message Details</div>
                <div class="field-group">
                  <div class="field message-field">
                    <div class="label">💬 Client Message</div>
                    <div class="value">${message}</div>
                  </div>
                </div>
              </div>

              <div class="footer">
                <p><strong>Action Required:</strong> Please respond to this inquiry within 24 hours</p>
                <p>This email was sent from your website contact form</p>
                <div class="footer-links">
                  <a href="mailto:${email}">Reply to Client</a> • 
                  <a href="https://anvithainfotech.com">Visit Website</a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
        };

        // Send email using AWS SES SMTP
        const info = await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send email' },
            { status: 500 }
        );
    }
}