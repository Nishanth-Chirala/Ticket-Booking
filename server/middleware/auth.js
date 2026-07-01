import { clerkClient } from '@clerk/express';

// server/middleware/auth.js

// server/middleware/auth.js

const normalizeRole = (value) => {
  if (typeof value === 'string') {
    return value.toLowerCase();
  }

  if (typeof value === 'boolean') {
    return value ? 'admin' : 'user';
  }

  return '';
};

export const isAdminUser = (user) => {
  // Merge both, instead of letting a truthy empty object win
  const metadata = {
    ...(user?.publicMetadata || {}),
    ...(user?.privateMetadata || {}),
  };

  const role = normalizeRole(metadata.role || metadata.isAdmin || metadata.admin);

  if (role === 'admin') {
    return true;
  }

  if (Array.isArray(metadata.roles)) {
    return metadata.roles.some((entry) => normalizeRole(entry) === 'admin');
  }

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const primaryEmail = user?.emailAddresses?.[0]?.emailAddress || user?.primaryEmailAddress?.emailAddress || '';

  return adminEmails.includes(primaryEmail.toLowerCase());
};

// middleware/auth.js
export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      console.error('[protectAdmin] No userId in req.auth — user not authenticated');
      return res.status(401).json({ success: false, message: 'Not Authenticated' });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!isAdminUser(user)) {
      console.error(`[protectAdmin] User ${userId} is not an admin`);
      return res.status(403).json({ success: false, message: 'Not Authorized' });
    }

    req.user = user; // Attach user to request for downstream use
    next();
  } catch (error) {
    console.error('[protectAdmin] Unexpected error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};