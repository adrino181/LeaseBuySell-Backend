import mongoose from "mongoose";

const Properties = new mongoose.Schema({
  listing_url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please Add Name"],
  },
  description: {
    type: String,
    required: false,
  },
  photos: [
    {
      imageUrl: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: "",
      },
      thumbnail: {
        type: String,
        required: true,
      },
    },
  ],
  address: {
    type: String,
    required: [true, "Please add address"],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Properties", Properties);
