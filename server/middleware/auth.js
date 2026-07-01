import { clerkClient } from '@clerk/express';

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
  const metadata = user?.publicMetadata || user?.privateMetadata || {};
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

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const user = await clerkClient.users.getUser(userId);

    if (!isAdminUser(user)) {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: 'Not Authorized' });
  }
};