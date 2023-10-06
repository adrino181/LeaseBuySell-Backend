import express, { Request, Response } from "express";
import Profile from "../models/profile.model";
const router = express.Router();
import UserDao from "../services/user.service";
import generateAuthToken from "../utils/generateAuthToken";
import verifyAuthentication from "../middlewares/auth.middleware";

router.post("/profile", (req: Request, res: Response) => {
  try {
    const { profile_type } = req.body;
    // const profile = req.profile;
    // const profile = Profile.findOneAndUpdate({
    //   user: req,
    // });
  } catch (e) {
    res.status(500).json({
      error: "Error in request",
    });
  }
});

export default router;
