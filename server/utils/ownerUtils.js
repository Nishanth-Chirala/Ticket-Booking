import Owner from '../models/Owner.js';
import User from '../models/User.js';

export const getOwnerEmailsFromEnv = () => {
  const raw = process.env.OWNER_EMAILS || process.env.ADMIN_EMAIL || '';
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const syncOwnersFromEnv = async () => {
  const emails = getOwnerEmailsFromEnv();

  for (const email of emails) {
    const existingUser = await User.findOne({ email });

    const owner = await Owner.findOneAndUpdate(
      { email },
      {
        $setOnInsert: { email },
        ...(existingUser
          ? {
              $set: {
                user: existingUser._id,
                name: existingUser.name || '',
              },
            }
          : {}),
      },
      { upsert: true, new: true }
    );

    if (existingUser && existingUser.role !== 'owner') {
      existingUser.role = 'owner';
      await existingUser.save();
    }

    if (existingUser && !owner.user) {
      owner.user = existingUser._id;
      owner.name = existingUser.name || '';
      await owner.save();
    }
  }

  console.log(`Owners synced from env: ${emails.length}`);
};

export const isOwnerEmail = async (email) => {
  const normalized = email.toLowerCase().trim();
  const fromEnv = getOwnerEmailsFromEnv().includes(normalized);
  if (fromEnv) return true;

  const owner = await Owner.findOne({ email: normalized });
  return Boolean(owner);
};

export const linkOwnerToUser = async (user) => {
  const owner = await Owner.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        user: user._id,
        name: user.name || '',
        email: user.email,
      },
    },
    { upsert: true, new: true }
  );

  return owner;
};
