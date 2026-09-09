import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

export const isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

export const getDashBoardData = async (req, res) => {
  try {
    const shows = await Show.find({ createdBy: req.user._id }).select('_id');
    const showIds = shows.map((show) => show._id);
    const bookings = await Booking.find({ isPaid: true, show: { $in: showIds } });
    const activeShows = await Show.find({
      createdBy: req.user._id,
      showDateTime: { $gte: new Date() },
    }).populate('movie');

    const totalUser = (await Booking.distinct('user', {
      isPaid: true,
      show: { $in: showIds },
    })).length;

    const dashBoardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    res.json({ success: true, dashBoardData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get All shows

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({
      createdBy: req.user._id,
      showDateTime: { $gte: new Date() },
    })
      .populate('movie')
      .sort({ showDateTime: 1 });

    res.json({ success: true, shows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get All Bookings

export const getAllBookings = async (req, res) => {
  try {
    const shows = await Show.find({ createdBy: req.user._id }).select('_id');
    const bookings = await Booking.find({
      show: { $in: shows.map((show) => show._id) },
    })
      .populate('user')
      .populate({
        path: 'show',
        populate: { path: 'movie' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
