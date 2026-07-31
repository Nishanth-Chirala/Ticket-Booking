import Movie from '../models/Movie.js';
import { buildMovieDocument } from '../utils/movieUtils.js';

export const createMovie = async (req, res) => {
  try {
    const movieData = buildMovieDocument(req.body);

    const movie = await Movie.create(movieData);

    res.json({ success: true, message: 'Movie added successfully', movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    res.json({ success: true, movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movieData = buildMovieDocument(req.body);
    const movie = await Movie.findByIdAndUpdate(req.params.id, movieData, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    res.json({ success: true, message: 'Movie updated successfully', movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
