import sendEmail from '../configs/nodeMailer.js';
import AdminRequest from '../models/AdminRequest.js';
import Owner from '../models/Owner.js';
import User from '../models/User.js';

export const requestAdminAccess = async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.json({
        success: false,
        message: 'Only regular users can request admin access',
      });
    }

    const existingPending = await AdminRequest.findOne({
      user: req.user._id,
      status: 'pending',
    });

    if (existingPending) {
      return res.json({
        success: false,
        message: 'You already have a pending admin access request',
      });
    }

    const request = await AdminRequest.create({
      user: req.user._id,
      message: req.body.message || '',
      status: 'pending',
    });

    const owners = await Owner.find({});
    const ownerEmails = [
      ...new Set(owners.map((owner) => owner.email).filter(Boolean)),
    ];

    if (ownerEmails.length > 0) {
      await Promise.allSettled(
        ownerEmails.map((email) =>
          sendEmail({
            to: email,
            subject: 'Admin Access Request - QuickShow',
            body: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>New Admin Access Request</h2>
                <p><strong>${req.user.name}</strong> (${req.user.email}) has requested admin access.</p>
                ${
                  request.message
                    ? `<p><strong>Message:</strong> ${request.message}</p>`
                    : ''
                }
                <p>Please log in to the QuickShow admin panel to approve or reject this request.</p>
              </div>
            `,
          })
        )
      );
    }

    res.json({
      success: true,
      message: 'Admin access request submitted',
      request,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getMyAdminRequest = async (req, res) => {
  try {
    const request = await AdminRequest.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, request });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const listAdminRequests = async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const filter = status === 'all' ? {} : { status };

    const requests = await AdminRequest.find(filter)
      .populate('user', 'name email role')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const approveAdminRequest = async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id).populate('user');

    if (!request || request.status !== 'pending') {
      return res.json({
        success: false,
        message: 'Pending request not found',
      });
    }

    const user = await User.findById(request.user._id);
    if (!user || user.role !== 'user') {
      return res.json({
        success: false,
        message: 'User is not eligible for admin promotion',
      });
    }

    user.role = 'admin';
    await user.save();

    request.status = 'approved';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    await sendEmail({
      to: user.email,
      subject: 'Admin Access Approved - QuickShow',
      body: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${user.name},</h2>
          <p>Your request for admin access has been <strong style="color: #16a34a;">approved</strong>.</p>
          <p>You can now sign in and open the admin dashboard.</p>
          <p>— QuickShow Team</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'User promoted to admin' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const rejectAdminRequest = async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id).populate('user');

    if (!request || request.status !== 'pending') {
      return res.json({
        success: false,
        message: 'Pending request not found',
      });
    }

    request.status = 'rejected';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    const user = request.user;

    await sendEmail({
      to: user.email,
      subject: 'Admin Access Rejected - QuickShow',
      body: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${user.name},</h2>
          <p>Your request for admin access has been <strong style="color: #dc2626;">rejected</strong>.</p>
          <p>Your account remains a regular user. You may request access again later if needed.</p>
          <p>— QuickShow Team</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Admin request rejected' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
