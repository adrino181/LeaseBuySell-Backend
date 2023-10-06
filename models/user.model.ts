import mongoose from "mongoose";
// import { VERIFICATION_METHOD } from "../slug/type";

export interface IUser extends mongoose.Document {
  phone: string;
  phone_extension: string;
  verification: {
    is_verified: boolean;
    otp_expiration: Date;
    otp_code: string;
    max_attempts: number;
  };
}
const User = new mongoose.Schema<IUser>({
  phone: {
    required: true,
    type: String,
    unique: true,
    max: 12,
  },
  phone_extension: {
    required: true,
    type: String,
    default: "+91",
    max: 4,
  },
  verification: {
    is_verified: {
      default: false,
      type: Boolean,
    },
    otp_expiration: {
      type: Date,
      default: Date.now(),
    },
    otp_code: {
      required: true,
      type: String,
      max: 6,
    },
    max_attempts: {
      required: true,
      type: Number,
      default: 3,
    },
  },
});

export default mongoose.model<IUser>("User", User);
