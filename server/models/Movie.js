import mongoose from 'mongoose';

const castSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    character_name: { type: String },
    profile_path: { type: String },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    backdrop_path: { type: String, required: true },
    release_date: { type: String, required: true },
    original_language: { type: String },
    tagline: { type: String },
    genres: { type: Array, required: true },
    casts: { type: [castSchema], default: [] },
    vote_average: { type: Number, required: true },
    runtime: { type: Number, required: true },
    status: { type: String, default: 'Coming Soon' },
    director: { type: String },
    trailer_url: { type: String },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
