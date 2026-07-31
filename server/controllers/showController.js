import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import { inngest } from '../inngest/index.js';

export const getNowPlayingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ status: 'Now Playing' }).sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const showsToCreate = [];

    showsInput.forEach((show) => {
      const showDate = show.date;
      if (!showDate || !show.time) return; // skip invalid entries

      // Ensure show.time is always treated as an array
      const times = Array.isArray(show.time) ? show.time : [show.time];

      times.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    await inngest.send({
      name: 'app/show.added',
      data: {
        movieTitle: movie.title,
      },
    });

    res.json({ success: true, message: 'Show Added Successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    const uniqueMovies = [];
    const seenMovieIds = new Set();

    shows.forEach((show) => {
      const movieId = show.movie?._id?.toString();
      if (!movieId || seenMovieIds.has(movieId)) {
        return;
      }

      seenMovieIds.add(movieId);
      uniqueMovies.push(show.movie);
    });

    res.json({ success: true, shows: uniqueMovies });
  } catch (error) {
    console.error(error);

    res.json({ success: false, message: error.message });
  }
};

export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });
    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      console.log(
        'Show ID being sent to frontend:',
        show._id,
        'Type:',
        typeof show._id,
        'Stringified:',
        show._id.toString()
      );
      dateTime[date].push({ time: show.showDateTime, showId: show._id.toString() });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
