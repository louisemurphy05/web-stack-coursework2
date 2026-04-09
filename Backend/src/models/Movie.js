import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String
  },
  genres: [{
    id: Number,
    name: String
  }],
  description: {
    type: String
  },
  poster: {
    type: String
  },
  backdrop: {
    type: String
  },
  releaseDate: {
    type: String
  },
  voteAverage: {
    type: Number
  },
  tmdbId: {
    type: String,
    unique: true
  },
  popularity: {
    type: Number
  }
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);