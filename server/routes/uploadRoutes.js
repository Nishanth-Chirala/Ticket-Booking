import express from 'express';
import multer from 'multer';
import { protectAdmin } from '../middleware/auth.js';
import { uploadImage } from '../controllers/uploadController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

const uploadRouter = express.Router();

uploadRouter.post('/', protectAdmin, upload.single('image'), uploadImage);

export default uploadRouter;
