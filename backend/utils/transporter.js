const nodemailer = require("nodemailer");
require("dotenv").config();

let smtpTransporter = null;

function getSmtpTransporter() {
    if (!smtpTransporter) {
        const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465;
        smtpTransporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port,
            secure: port === 465,
            connectionTimeout: 8000, // Fail fast if cloud provider blocks outbound port
            greetingTimeout: 8000,
            socketTimeout: 8000,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return smtpTransporter;
}

const transporter = {
    sendMail: async function (options) {
        const { from, to, subject, text, html } = options;

        // 1. If Resend API Key is provided (Recommended for Render free tier over HTTPS port 443)
        if (process.env.RESEND_API_KEY) {
            const sender = process.env.EMAIL_FROM || "eWrite <onboarding@resend.dev>";
            const recipients = Array.isArray(to) ? to : [to];

            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.RESEND_API_KEY.trim()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: sender,
                    to: recipients,
                    subject,
                    text,
                    html,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : "Failed to send email via Resend API");
                console.error("Resend API error:", data);
                throw new Error(`Resend API error: ${errorMsg}`);
            }
            return data;
        }

        // 2. If Brevo HTTP API Key is provided
        if (process.env.BREVO_API_KEY) {
            const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || from;
            const res = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: { email: senderEmail, name: "eWrite" },
                    to: (Array.isArray(to) ? to : [to]).map((e) => ({ email: e })),
                    subject,
                    htmlContent: html,
                    textContent: text,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to send email via Brevo API");
            }
            return data;
        }

        // 3. Fallback to standard Nodemailer SMTP (for local dev or paid hosting)
        return await getSmtpTransporter().sendMail(options);
    },
};

module.exports = transporter;