import { Readable } from 'stream';
import cloudinary from '../configs/cloudinary.js';

const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: 'No image file provided' });
    }

    const folder = req.body.folder || 'ticket-booking';
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload failed', error);
    res.json({ success: false, message: 'Image upload failed' });
  }
};
