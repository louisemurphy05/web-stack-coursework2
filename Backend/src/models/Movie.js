import mongoose from "mongoose";

// Movie schema defining the structure of movie documents in MongoDB, including fields like title, overview, 
// poster/backdrop paths, release date, rating, TMDB ID, popularity, and genres
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