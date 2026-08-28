import express from 'express';
import { protect, protectOwner } from '../middleware/auth.js';
import {
  approveAdminRequest,
  getMyAdminRequest,
  listAdminRequests,
  rejectAdminRequest,
  requestAdminAccess,
} from '../controllers/adminRequestController.js';

const adminRequestRouter = express.Router();

adminRequestRouter.post('/request', protect, requestAdminAccess);
adminRequestRouter.get('/my-request', protect, getMyAdminRequest);
adminRequestRouter.get('/', protectOwner, listAdminRequests);
adminRequestRouter.post('/:id/approve', protectOwner, approveAdminRequest);
adminRequestRouter.post('/:id/reject', protectOwner, rejectAdminRequest);

export default adminRequestRouter;
