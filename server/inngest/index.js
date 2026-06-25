import { Inngest } from 'inngest';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import mongoose from 'mongoose';

export const inngest = new Inngest({ id: 'movie-ticket-booking' });

// User Creation
const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-clerk',
    event: 'clerk/user.created', // Merged trigger into the first object
  },
  async ({ event }) => { // Handler function is now the second argument
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
    event: 'clerk/user.deleted', // Merged trigger into the first object
  },
  async ({ event }) => { // Handler function is now the second argument
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Update user
const syncUserUpdation = inngest.createFunction(
  {
    id: 'update-user-with-clerk',
    event: 'clerk/user.updated', // Merged trigger into the first object
  },
  async ({ event }) => { // Handler function is now the second argument
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

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
];
