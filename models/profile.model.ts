import mongoose from "mongoose";

const { Schema } = mongoose;
const PROFILE_STATE = ["IS_NEW", "IS_PAID"];
export const USER_TYPE = ["BROKER", "OWNER", "BUYER", "TENANT", "USER"];

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  properties: [
    {
      type: Schema.Types.ObjectId,
      ref: "Properties",
    },
  ],
  address: {
    type: String,
    required: false,
  },
  formattedAddress: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    // GeoJSON Points
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  bio: { type: String, default: "" },
  phone: {
    type: Number,
    required: false,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  profileType: {
    type: String,
    enum: USER_TYPE,
    default: "SELLER",
  },
  profileState: {
    type: String,
    enum: PROFILE_STATE,
    default: "IS_NEW",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Profile", profileSchema);
