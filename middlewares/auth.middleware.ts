import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/user.model";
import { isValidId } from "../utils/helper";
import Profile from "../models/profile.model";
const privateKey = process.env.JWT_KEY;

const verifyAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      throw new Error("AUTH_ERROR");
    }
    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, privateKey as Secret) as {
      userId: string;
      profileId: string;
    };
    if (!decoded || !decoded.userId || !isValidId(decoded.userId)) {
      throw new Error("Token Invalild");
    }
    const profile = await Profile.findOne({ userId: decoded.userId }).exec();
    if (!profile) {
      throw new Error("PROFILE_INCOMPLETE");
    }
    Object.assign(req, { profile: profile, userId: decoded.userId });
    next();
  } catch (error: any) {
    switch (error.message) {
      case "PROFILE_INCOMPLETE":
        res.status(202).json({
          message: "!!!Profile Incomplete!!!",
          status: "incomplete",
        });
        break;
      case "VERIFICATION_NEEDED":
        res.status(203).json({
          message: "!!!Verification Incomplete!!!",
          status: "verify",
        });
        break;
      default:
        res.status(401).json({
          message: "You're not authorized to acess this information.",
          error: error.message,
        });
    }
  }
};

export default verifyAuthentication;
