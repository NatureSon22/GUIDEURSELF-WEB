import crypto from "crypto";

const generateVerificationCode = () => {
  // Generate a random 6-digit number
  const verificationCode = crypto.randomInt(100000, 999999);
  return verificationCode.toString();
};

export default generateVerificationCode;
