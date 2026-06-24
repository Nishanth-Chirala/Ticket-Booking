import { Inngest } from 'inngest';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import sendEmail from '../configs/nodeMailer.js';
import mongoose from 'mongoose';

export const inngest = new Inngest({ id: 'movie-ticket-booking' });

// User Creation

const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-clerk',
  },
  {
    event: 'clerk/user.created',
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address,
      name: first_name + ' ' + last_name,
      image: image_url,
    };

    await User.create(userData);
  }
);

// Delete User

const syncUserDeletion = inngest.createFunction(
  {
    id: 'delete-user-with-clerk',
  },
  {
    event: 'clerk/user.deleted',
  },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Update user

const syncUserUpdation = inngest.createFunction(
  {
    id: 'update-user-with-clerk',
  },
  {
    event: 'clerk/user.updated',
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData);
  }
);

const releaseSeatsAndDeleteBookings = inngest.createFunction(
  {
    id: 'release-seats-delete-booking',
  },
  {
    event: 'app/checkpayment',
  },
  async ({ event, step }) => {
    const tenMinutes = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil('wait-for-10-minutes', tenMinutes);

    await step.run('check-payment-status', async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      if (!booking.isPaid) {
        // Validate if booking.show is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(booking.show)) {
          console.log('Invalid ObjectId for show:', booking.show);
          return;
        }

        const show = await Show.findById(booking.show);
        if (!show) {
          console.log('Show not found:', booking.show);
          return;
        }

        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });

        show.markModified('occupiedSeats');
        await show.save();
        await Booking.findByIdAndDelete(booking._id);
      }
    });
  }
);

const sendEmailBook = inngest.createFunction(
  {
    id: 'send-booking-email',
  },
  { event: 'app/show.booked' },

  async ({ event, step }) => {
    const { bookingId } = event.data;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
          model: 'Movie',
        },
      })
      .populate('user');

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
      body: ` <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>Hi ${booking.user.name},</h2>
    <p>Your booking for <strong style="color: #F84565;">${
      booking.show.movie.title
    }</strong> is confirmed.</p>
    <p>
        <strong>Date:</strong> ${new Date(
          booking.show.showDateTime
        ).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
        <strong>Time:</strong> ${new Date(
          booking.show.showDateTime
        ).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
    </p>
    <p>Enjoy the show! 🍿</p>
    <p>Thanks for booking with us!<br/>- QuickShow Team</p>
</div>  `,
    });
  }
);

const sendShowReminders = inngest.createFunction(
  {
    id: 'send-show-reminders',
  },
  { cron: '0 */8 * * *' }, // Execute after every 8 Hrs

  async ({ step }) => {
    const now = new Date();

    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    // reminder

    const reminder = await step.run('prepare-remainder-tasks', async () => {
      const shows = await Show.find({
        showTime: { $gte: windowStart, $lte: in8Hours },
      }).populate('movie');

      const tasks = [];

      for (const show of shows) {
        if (!shows.movie || !show.occupiedSeats) continue;

        const usersId = [...new Set(Object.values(show.occupiedSeats))];

        if (usersId.length === 0) continue;

        const users = await User.find({
          _id: { $in: usersId },
        }).select('name email');

        for (const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTIme: show.showTime,
          });
        }
      }
      return tasks;
    });

    if (reminder.length === 0) {
      return {
        sent: 0,
        message: 'No reminders to Send',
      };
    }

    const results = await step.run('send-all-reminders', async () => {
      return await Promise.allSettled(
        reminder.map((task) =>
          sendEmail({
            to: task.userEmail,
            subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
            body: ` <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Hello ${task.userName},</h2>
    <p>This is a quick reminder that your movie:</p>
    <h3 style="color: #F84565;">${task.movieTitle}</h3>
    <p>is scheduled for <strong>${new Date(task.showTime).toLocaleDateString(
      'en-US',
      { timeZone: 'Asia/Kolkata' }
    )}</strong> at <strong>${new Date(task.showTime).toLocaleTimeString(
              'en-US',
              { timeZone: 'Asia/Kolkata' }
            )}</strong>.</p>
    <p>It starts in approximately <strong>8 hours</strong> - make sure you're ready!</p>
    <br/>
    <p>Enjoy the show!<br/>QuickShow Team</p>
  </div>`,
          })
        )
      );
    });
    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s), ${failed} Failed`,
    };
  }
);

const newShowNotification = inngest.createFunction(
  {
    id: 'send-new-show-notification',
  },
  { event: 'app/show.added' },
  async ({ event }) => {
    const { movieTitle } = event.data;
    const users = await User.find({});

    for (const user of users) {
      const userEmail = user.email;
      const userName = user.name;

      const subject = `🎥 New Show Added: ${movieTitle}`;
      const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Hi ${userName},</h2>
    <p>We've just added a new show to our library:</p>
    <h3 style="color: #F84565;">${movieTitle}</h3>
    <p>Visit our website</p>
    <br>
    <p>Thanks,<br/>QuickShow Team</p>
</div>`;
      await sendEmail({
        to: userEmail,
        subject,
        body,
      });
    }
    return {
      message: 'Notification Sent',
    };
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBookings,
  sendEmailBook,
  sendShowReminders,
  newShowNotification,
];