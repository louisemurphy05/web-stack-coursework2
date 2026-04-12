import mongoose from "mongoose";

// Review schema defining the structure of review documents in MongoDB, including fields for user reference, movie ID, 
// rating, and comment
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  movieId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    maxLength: 1000
  }
}, { timestamps: true });

reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);