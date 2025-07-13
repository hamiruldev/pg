import { NextResponse } from 'next/server';
import { getDealerInfo } from '../../lib/data';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const toEmail = formData.dealerEmail;

    // Configure nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Set in .env.local
        pass: process.env.GMAIL_PASS, // Set in .env.local (App Password)
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: toEmail,
      subject: 'New GAP Registration',
      text: `New registration received:\n\n${JSON.stringify(formData, null, 2)}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 