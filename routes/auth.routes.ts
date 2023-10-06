import express from "express";
const router = express.Router();
import UserDao from "../services/user.service";
import generateAuthToken from "../utils/generateAuthToken";
const allowedExtension = ["+91"];

router.post("/generateToken", async (req, res) => {
  try {
    const { extension, phone } = req.body;
    if (!phone || !extension) {
      throw new Error("Missing fields");
    }
    if (!allowedExtension.includes(extension)) {
      throw new Error("Wrong Extension");
    }
    const user = await UserDao.getUserAndCreateIfNotExist(phone, extension);
    if (!user) {
      throw new Error("user not found");
    }
    const { token } = await UserDao.makeNewOtpToken(user);

    res.status(200).json({ token });
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
});

router.post("/verifyOtp", async (req, res) => {
  try {
    const { otp } = req.body;
    const loginToken = req.headers.authorization as string;
    if (!loginToken) {
      throw new Error("Token Missing");
    }
    if (!otp || typeof otp !== "string" || otp.length !== 6) {
      throw new Error("OTP missing");
    }
    const data = await UserDao.verifyOtp(loginToken, otp);
    res.status(200).json({ message: "SUCCESS", data });
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
});

export default router;
