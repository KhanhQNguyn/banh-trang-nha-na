import { cloudinary } from '../../config/cloudinary.js';
import { AppError } from '../../utils/AppError.js';

export const mediaService = {
  uploadImage: async (fileBuffer, folder = 'products') => {
    return new Promise((resolve, reject) => {
      // If cloudinary is not configured properly or is mock
      if (cloudinary.config().cloud_name === 'mock') {
        console.log('🤖 Mock Cloudinary: Resolving with mock URL');
        return resolve({
          secure_url: 'https://picsum.photos/seed/banh-trang/800/600',
          public_id: `mock_${Date.now()}`
        });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(new AppError(500, `Cloudinary upload failed: ${error.message}`));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  },

  deleteImage: async (publicId) => {
    if (cloudinary.config().cloud_name === 'mock') {
      console.log('🤖 Mock Cloudinary: Deleting mock asset');
      return { result: 'ok' };
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new AppError(500, `Cloudinary asset deletion failed: ${error.message}`);
    }
  }
};
