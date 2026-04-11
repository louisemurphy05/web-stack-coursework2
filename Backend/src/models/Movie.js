import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String
  },
  poster_path: {
    type: String
  },
  backdrop_path: {
    type: String
  },
  release_date: {
    type: String
  },
  vote_average: {
    type: Number
  },
  tmdbId: {
    type: String,
    unique: true
  },
  popularity: {
    type: Number
  },
  genres: [{
    id: Number,
    name: String
  }]
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);