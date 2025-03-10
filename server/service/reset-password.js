import fetch from "node-fetch";
import { config } from "dotenv";

config();

const sendPasswordResendEmail = async (email, password, device) => {
  const isMobile = device === "mobile";

  try {
    const loginUrl = `${
      process.env.CLIENT_URL
    }/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(
      password
    )}`;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY, // Use api-key header
      },
      body: JSON.stringify({
        sender: {
          name: "GUIDEURSELF",
          email: "sonn99797@gmail.com",
        },
        to: [
          {
            email: email,
            name: email, // Using the email as the recipient's name
          },
        ],
        subject: "Password Resend Request",
        htmlContent: ```
        <body style="font-family: 'Poppins', sans-serif; background-color: #f4f7fc; margin: 0; padding: 30px; text-align: center; color: #333;">
          <div class="container" style="max-width: 500px; background: #ffffff; padding: 40px 30px; border-radius: 15px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); margin: auto;">
            <div class="logo" style="margin-bottom: 40px;">
              <img src="https://ucarecdn.com/9903e978-ffd0-4306-a6b6-a8ddda5b6b7e/-/preview/310x96/" alt="GuideURSelf Logo" style="max-width: 240px; height: auto;" />
            </div>
            <div class="header" style="font-size: 26px; font-weight: 600; color: #2c3e50; margin-bottom: 25px;">Password Resend Request</div>
            <div class="content" style="text-align: left; font-size: 15px; color: #555; line-height: 1.8;">
              <p>Your password has been resent. Here are your login credentials:</p>
              
              <div class="credentials" style="background-color: rgba(18, 165, 188, 0.1); padding: 20px; border-radius: 8px; margin: 25px 0; font-weight: 500; color: #2c3e50; border: 1px solid rgba(18, 165, 188, 0.2);">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
              </div>
              
              <p><strong>For your security, please:</strong></p>
              <ul class="security-list" style="list-style: none; padding: 0; margin: 20px 0;">
                <li style="margin: 10px 0; padding-left: 20px; position: relative; color: #444;">Do not share your login credentials with anyone.</li>
                <li style="margin: 10px 0; padding-left: 20px; position: relative; color: #444;">Change your password after logging in.</li>
              </ul>
              
              ${
                !isMobile && (
                  <div style="text-align: center;">
                    <a
                      href="${loginUrl}"
                      class="button"
                      style="display: inline-block; padding: 14px 32px; margin: 25px 0; background: linear-gradient(135deg, rgba(18, 165, 188, 1), rgba(0, 123, 255, 1)); color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500; transition: 0.3s ease-in-out; box-shadow: 0 4px 12px rgba(18, 165, 188, 0.2);"
                    >
                      Login to Your Account
                    </a>
                  </div>
                )
              }
             
            </div>
            
            <div class="footer" style="font-size: 13px; color: #888; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              If you didn't request this, please <a href="mailto:support@guideurself.com" style="color: rgba(18, 165, 188, 1); text-decoration: none;">contact support</a>.<br>
              &copy; 2025 GuideURSelf. All rights reserved.
            </div>
          </div>
        </body>
        ```,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send email: ${errorData.message || response.statusText}`
      );
    }

    console.log("Password resend email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendPasswordResendEmail;
