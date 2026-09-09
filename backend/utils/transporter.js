require("dotenv").config();

let nodemailer = null;
let smtpTransporter = null;

function getSmtpTransporter() {
    if (!nodemailer) {
        nodemailer = require("nodemailer");
    }
    if (!smtpTransporter) {
        const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465;
        smtpTransporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port,
            secure: port === 465,
            connectionTimeout: 5000,
            greetingTimeout: 5000,
            socketTimeout: 5000,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return smtpTransporter;
}

const transporter = {
    /**
     * Send email via HTTPS API (Resend) or fallback to SMTP for local development.
     * @param {Object} options - { from, to, subject, text, html }
     */
    sendMail: async function (options) {
        const { from, to, subject, text, html } = options;

        // 1. Primary Email Method: Resend HTTPS API (Port 443 - Works reliably on Render Free)
        if (process.env.RESEND_API_KEY) {
            const sender = process.env.EMAIL_FROM || from || "eWrite <onboarding@resend.dev>";
            const recipients = Array.isArray(to) ? to : [to];

            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.RESEND_API_KEY.trim()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: sender,
                    to: recipients,
                    subject: subject,
                    text: text,
                    html: html,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || (data.errors ? JSON.stringify(data.errors) : "Failed to send email via Resend API");
                console.error("Resend API error:", data);
                throw new Error(`Resend HTTPS API error: ${errorMessage}`);
            }

            return data;
        }

        // 2. Cloud Environment Guard: Prevent hanging and timeouts on Render Free
        const isCloudEnv = process.env.RENDER || process.env.NODE_ENV === "production";
        if (isCloudEnv) {
            throw new Error(
                "Email delivery failed: RESEND_API_KEY environment variable is not set on Render. " +
                "Render Free blocks outbound SMTP ports 465 and 587. " +
                "Please add RESEND_API_KEY to your Render Web Service environment variables."
            );
        }

        // 3. Local Development Fallback: Nodemailer SMTP
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            return await getSmtpTransporter().sendMail(options);
        }

        throw new Error(
            "No email service configured. Please set RESEND_API_KEY (for HTTPS API) or EMAIL_USER and EMAIL_PASS (for SMTP)."
        );
    },
};

module.exports = transporter;