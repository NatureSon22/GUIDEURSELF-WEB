import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const transport = nodemailer.createTransport({
  host: process.env.GMAIL_HOST, // usually: smtp.gmail.com
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendLoginVerificationCode = async (email, username, verificationCode) => {
  const mail = {
    from: `"GUIDEURSELF" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Login Verification Code",
    html: `
      <body style="font-family: 'Poppins', sans-serif; background-color: #f4f7fc; margin: 0; padding: 30px; text-align: center; color: #333;">
        <div style="max-width: 500px; background: #ffffff; padding: 40px 30px; border-radius: 15px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); margin: auto;">
          <div style="margin-bottom: 40px;">
            <img src="https://ucarecdn.com/9903e978-ffd0-4306-a6b6-a8ddda5b6b7e/-/preview/310x96/" alt="GuideURSelf Logo" style="max-width: 240px; height: auto;" />
          </div>
          <div style="font-size: 26px; font-weight: 600; color: #2c3e50; margin-bottom: 25px;">
            Hello, ${username}!
          </div>
          <div style="text-align: left; font-size: 15px; color: #555; line-height: 1.8;">
            <p>We received a request to log in to your account. Please use the verification code below to complete the login process:</p>
            <div style="background-color: rgba(18, 165, 188, 0.1); padding: 20px; border-radius: 8px; margin: 25px 0; font-weight: 500; color: #2c3e50; border: 1px solid rgba(18, 165, 188, 0.2);">
              <p><strong>Verification Code:</strong> <span style="font-size: 24px; font-weight: 600;">${verificationCode}</span></p>
            </div>
            <p>Enter this code in the login page to access your account.</p>
            <p>If you didn't request this login, please disregard this email.</p>
          </div>
          <div style="font-size: 13px; color: #888; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            &copy; 2025 GuideURSelf. All rights reserved.
          </div>
        </div>
      </body>
    `,
  };

  try {
    const info = await transport.sendMail(mail);
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendLoginVerificationCode;
