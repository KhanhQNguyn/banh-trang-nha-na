import { mediaService } from './media.service.js';
import { mediaValidators } from './media.validators.js';
import { mediaDto } from './media.dto.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const uploadImage = catchAsync(async (req, res, next) => {
  mediaValidators.validateUpload(req);
  
  const folder = req.body.folder || 'products';
  const result = await mediaService.uploadImage(req.file.buffer, folder);

  return sendSuccess(res, {
    statusCode: 211,
    message: 'Image uploaded successfully',
    data: mediaDto.uploadResponse(result)
  });
});

export const deleteImage = catchAsync(async (req, res, next) => {
  const { publicId } = req.params;
  await mediaService.deleteImage(publicId);

  return sendSuccess(res, {
    message: 'Image deleted successfully'
  });
});
