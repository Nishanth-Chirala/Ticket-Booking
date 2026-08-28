import mongoose from 'mongoose';
import {
  getOwnerEmailsFromEnv,
  syncOwnersFromEnv,
} from '../utils/ownerUtils.js';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log('DataBase Connected')
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/ticketOne`);
    await syncOwnersFromEnv();

    if (!getOwnerEmailsFromEnv().length) {
      console.warn(
        'No OWNER_EMAILS configured. Add OWNER_EMAILS to .env to seed owners.'
      );
    }
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
