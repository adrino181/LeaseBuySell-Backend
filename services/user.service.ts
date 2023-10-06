import User, { IUser } from "../models/user.model";
import Profile from "../models/profile.model";
import bcrypt from "bcrypt";
import generateAuthToken from "../utils/generateAuthToken";
import jwt, { Jwt } from "jsonwebtoken";
// const { uploadFile } = require("./helper");
const userType = {};
import { randHex, isValidId } from "../utils/helper";
const hexKey = process.env.JWT_KEY as string;
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_ID;
const client = require("twilio")(accountSid, authToken);
import { USER_TYPE } from "../models/profile.model";
type profileCreateType = {
  user_type: string;
  user: IUser;
};
export default class UserDao {
  static deleteUser() {}
  static async sendPhoneMsg(code: number, phone: string) {
    const data = await client.messages.create({
      body: `Your One time Passwrod ${code}`,
      messagingServiceSid: messagingServiceSid,
      to: phone,
    });
    console.log(data, "data comign");
    if (!data) {
      throw new Error("request failed");
    }
  }
  static async makeNewOtpToken(user: IUser) {
    const currTime = new Date().getTime();
    //adding 5 min cooldown to expiration time
    const expirationTime =
      (user?.verification?.otp_expiration?.getTime() as number) + 5 * 1000 * 60;
    const expired = currTime > expirationTime;
    if (!user?.verification?.max_attempts && !expired) {
      throw new Error("SMS Limit Exceeded Try After 5 mins");
    }
    const max_attempts = (user?.verification?.max_attempts as number) - 1;
    const otp_expiration = new Date();
    const otp_code = randHex();
    const phone_number = `${user.phone_extension}${user.phone}`;
    //const sendOtp = await this.sendPhoneMsg(otp_code, phone_number);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id },
        {
          $set: {
            "verification.max_attempts": max_attempts,
            "verification.otp_expiration": otp_expiration,
            "verification.otp_code": otp_code,
            "verification.is_verified": false,
          },
        },
        {
          new: true,
          returnNewDocument: true,
        }
      );
      const generateToken = jwt.sign(
        {
          userId: user._id,
        },
        hexKey,
        {
          expiresIn: "1h", // expires in 1 hour
        }
      );

      return { otp: updatedUser?.verification.otp_code, token: generateToken };
    } catch (e: any) {
      throw new Error(e);
    }
  }

  static async getUserAndCreateIfNotExist(phone: string, extension: string) {
    const phoneNumber = `${extension}${phone}`;
    const user: IUser | null = await User.findOne({ phone: phone }).exec();

    if (user) {
      return user;
    } else {
      const otp = randHex();
      const newUser: IUser | null = new User({
        phone: phone,
        phone_extension: extension,
        verification: {
          otp_code: otp,
          otp_expiration: new Date(),
        },
      });

      await newUser.save();
      if (!newUser) {
        throw new Error("Error in creating Users");
      }
      return newUser;
    }
  }

  static async verifyOtp(token: string, otp: string) {
    const isTokenValid = jwt.verify(token, hexKey) as {
      userId: string;
    };
    if (!isTokenValid) {
      throw new Error("Token Expired or Invalid");
    }
    const userId = isTokenValid.userId as string;
    if (!isValidId(userId)) {
      throw new Error("Invalid Keys");
    }
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      throw new Error("User Not Found");
    }
    if (user.verification.otp_code !== otp) {
      throw new Error("Otp Not Matching");
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user.id },
      {
        $set: {
          "verification.is_verified": true,
        },
      }
    );

    const profile = await Profile.findOne({ user: user.id }).exec();
    let data = profile || null;

    const generatedToken = jwt.sign(
      {
        userId: user._id,
        ...(profile?._id ? { profileId: profile?._id } : {}),
      },
      hexKey,
      {}
    );

    return {
      data: data,
      token: generatedToken,
    };
  }

  static async createProfile(params: profileCreateType) {
    const profile = new Profile({ userId: params.user.id });
    await profile.save();
  }

  static async resendOtp() {}
}
