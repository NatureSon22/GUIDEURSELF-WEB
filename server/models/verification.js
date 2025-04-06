import { Schema, model } from "mongoose";

const LoginCodeSchema = new Schema(
  {
    user_id: { type: String, required: true, ref: "User" },
    verification_code: { type: String, required: true },
    expiration_date: {
      type: Date,
      required: true,
    },
    attempts: { type: Number, default: 0 },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "used", "expired"],
    },
    blocked_for: { type: Number, default: 60 }, // Block duration in minutes
    blocked_at: { type: Date, default: null }, // Track when the block occurred
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

LoginCodeSchema.methods.getBlockExpirationTime = function () {
  return this.blocked_at
    ? new Date(this.blocked_at).getTime() + this.blocked_for * 60 * 1000
    : null;
};

// Check if the user is currently blocked
LoginCodeSchema.methods.isBlocked = function () {
  const expiration = this.getBlockExpirationTime();
  return expiration ? Date.now() < expiration : false;
};

// Get the actual block expiration as a Date object
LoginCodeSchema.methods.getBlockExpiration = function () {
  const expiration = this.getBlockExpirationTime();
  return expiration ? new Date(expiration) : null;
};

// Increment the attempts and block user if needed
LoginCodeSchema.methods.incrementAttempts = async function () {
  if (this.attempts >= 3) {
    this.blocked_at = new Date(); // Block the user at the current time
    await this.save();
  } else {
    this.attempts += 1;
    await this.save();
  }
};

// Reset on successful verification
LoginCodeSchema.methods.resetAfterSuccess = async function () {
  this.status = "used";
  this.attempts = 0;
  this.blocked_at = null; // Reset block time on successful verification
  await this.save();
};

// This will not auto-delete records based on expiration time anymore
LoginCodeSchema.statics.cleanUpOldCodes = function () {
  // Optional: You can manually trigger cleanup for codes that are "used" or "expired".
  return this.deleteMany({ status: { $in: ["used", "expired"] } });
};

LoginCodeSchema.virtual("blockTimeLeft").get(function () {
  const expiration = this.getBlockExpirationTime();
  return expiration ? Math.max(0, expiration - Date.now()) : 0;
});

const LoginCode = model("LoginCode", LoginCodeSchema);

export default LoginCode;