import { AppError } from '../../utils/AppError.js';

export const mediaValidators = {
  validateUpload: (req) => {
    if (!req.file && (!req.files || req.files.length === 0)) {
      throw new AppError(400, 'No image file uploaded');
    }
  }
};
