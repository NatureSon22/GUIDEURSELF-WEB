import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const sendPasswordResendEmail = async (email, password, device) => {
  try {
    const loginUrl = `${
      process.env.CLIENT_URL
    }/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(
      password
    )}`;

    const transporter = nodemailer.createTransport({
      host: process.env.GMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `GUIDEURSELF <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <body style="font-family: 'Poppins', sans-serif; background-color: #f4f7fc; margin: 0; padding: 30px; text-align: center; color: #333;">
          <div class="container" style="max-width: 500px; background: #ffffff; padding: 40px 30px; border-radius: 15px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); margin: auto;">
            <div class="logo" style="margin-bottom: 40px;">
              <img src="https://ucarecdn.com/9903e978-ffd0-4306-a6b6-a8ddda5b6b7e/-/preview/310x96/" alt="GuideURSelf Logo" style="max-width: 240px; height: auto;" />
            </div>
            <div class="header" style="font-size: 26px; font-weight: 600; color: #2c3e50; margin-bottom: 25px;">Password Reset Request</div>
            <div class="content" style="text-align: left; font-size: 15px; color: #555; line-height: 1.8;">
              <p>Your password has been resent. Here are your login credentials:</p>
              <div class="credentials" style="background-color: rgba(18, 165, 188, 0.1); padding: 20px; border-radius: 8px; margin: 25px 0; font-weight: 500; color: #2c3e50; border: 1px solid rgba(18, 165, 188, 0.2);">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${Array(password.length).fill("*").join("")}</p>
              </div>
              <p><strong>For your security, please:</strong></p>
              <ul class="security-list" style="list-style: none; padding: 0; margin: 20px 0;">
                <li style="margin: 10px 0; padding-left: 20px; position: relative; color: #444;">Do not share your login credentials with anyone.</li>
                <li style="margin: 10px 0; padding-left: 20px; position: relative; color: #444;">Change your password after logging in.</li>
              </ul>
              <div style="text-align: center;">
                <a href="${loginUrl}" class="button" style="display: inline-block; padding: 14px 32px; margin: 25px 0; background: linear-gradient(135deg, rgba(18, 165, 188, 1), rgba(0, 123, 255, 1)); color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500; transition: 0.3s ease-in-out; box-shadow: 0 4px 12px rgba(18, 165, 188, 0.2);">Login to Your Account</a>
              </div>
            </div>
            <div class="footer" style="font-size: 13px; color: #888; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              If you didn't request this, please <a href="mailto:support@guideurself.com" style="color: rgba(18, 165, 188, 1); text-decoration: none;">contact support</a>.<br>
              &copy; 2025 GuideURSelf. All rights reserved.
            </div>
          </div>
        </body>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendPasswordResendEmail;