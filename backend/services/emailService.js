import nodemailer from 'nodemailer';

const isConfigured = () => Boolean(process.env.SMTP_HOST);

const getTransporter = () => nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
});

const send = async (to, subject, html) => {
    if (!isConfigured()) {
        console.log(`[email-not-configured] To: ${to} | Subject: ${subject}`);
        return;
    }
    try {
        const transporter = getTransporter();
        await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, html });
        console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error('Email send failed:', error.message);
    }
};

export const sendBookingEmail = async (booking) => {
    const html = `
    <h2>Booking Request Received — ${booking.bookingRef}</h2>
    <p>Hi ${booking.name},</p>
    <p>Thank you for booking with Makolo Adventure Tours. Here are your details:</p>
    <ul>
      <li>Package: ${booking.packageTour}</li>
      <li>Travel Date: ${new Date(booking.travelDate).toLocaleDateString()}</li>
      <li>Adults: ${booking.adults} | Children: ${booking.children}</li>
      <li>Total: $${booking.totalPrice}</li>
      <li>Reference: <strong>${booking.bookingRef}</strong></li>
    </ul>
    <p>Our team will confirm availability within 24 hours.</p>`;
    await send(booking.email, `Your Booking Request — ${booking.bookingRef}`, html);
};

export const sendStatusChangeEmail = async (booking, oldStatus) => {
    const html = `
    <h2>Booking Update — ${booking.bookingRef}</h2>
    <p>Hi ${booking.name},</p>
    <p>Your booking status changed from <strong>${oldStatus}</strong> to <strong>${booking.status}</strong>.</p>
    <p>If you have questions, reply to this email or reach us on WhatsApp.</p>`;
    await send(booking.email, `Booking Update — ${booking.bookingRef}`, html);
};

export const sendInquiryEmail = async (inquiry) => {
    const html = `
    <h2>New Custom Inquiry</h2>
    <p><strong>${inquiry.name}</strong> (${inquiry.email}, ${inquiry.phone})</p>
    <p>Destinations: ${inquiry.destinations}</p>
    <p>Duration: ${inquiry.duration} | Budget: $${inquiry.budget}</p>
    <p>Message: ${inquiry.message}</p>`;
    await send(process.env.MAIL_FROM, 'New Custom Inquiry Received', html);
};

export const sendInquiryReply = async (inquiry, status) => {
    const html = `
    <h2>Your Custom Inquiry Status</h2>
    <p>Hi ${inquiry.name},</p>
    <p>Your tailor-made inquiry status has been updated to <strong>${status}</strong>.</p>
    <p>Our team will be in touch shortly.</p>`;
    await send(inquiry.email, `Inquiry Update — ${status}`, html);
};
