import express from 'express';
import {
  createMovie,
  deleteMovie,
  getMovieById,
  listMovies,
  updateMovie,
} from '../controllers/movieController.js';
import { protectAdmin } from '../middleware/auth.js';

const movieRouter = express.Router();

movieRouter.post('/', protectAdmin, createMovie);
movieRouter.get('/', listMovies);
movieRouter.get('/:id', getMovieById);
movieRouter.put('/:id', protectAdmin, updateMovie);
movieRouter.delete('/:id', protectAdmin, deleteMovie);

export default movieRouter;
