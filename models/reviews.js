const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be below 0"],
      max: [5, "Rating cannot be above 5 "],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
