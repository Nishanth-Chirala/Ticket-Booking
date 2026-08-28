import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';
import User from '../models/User.js';

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updatFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
    } else {
      user.favorites = user.favorites.filter((item) => item !== movieId);
    }

    await user.save();

    res.json({ success: true, message: 'Favorite Movies Updated' });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const movies = await Movie.find({ _id: { $in: user.favorites } });

    res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
