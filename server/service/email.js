import fetch from "node-fetch";
import { config } from "dotenv";

config();

const sendVerificationEmail = async (email, username, password) => {
  try {
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
            name: "Recipient Name", // Optional
          },
        ],
        subject: "Email Verification",
        htmlContent: `
          <html>
            <head></head>
            <body>
              <p>Dear ${username},</p>
              <p>We are pleased to share your account credentials. These credentials will grant you access to our platform. For your security, please keep this information confidential and do not share it with anyone.</p>
              <p>Here are your login details:</p>
               
              <ul>
                <li><b>Email:</b> ${email}</li>
                <li><b>Password:</b> ${password}</li>
              </ul>

              <p>If you have any questions or encounter any issues accessing your account, please feel free to reach out to our support team.</p>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send email: ${errorData.message || response.statusText}`
      );
    }

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendVerificationEmail;
