import { customerService } from './customer.service.js';
import { customerValidators } from './customer.validators.js';
import { customerDto } from './customer.dto.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { AppError } from '../../utils/AppError.js';

export const getMe = catchAsync(async (req, res, next) => {
  const customer = await customerService.getCustomerByUserId(req.user.id);
  if (!customer) {
    throw new AppError(404, 'Customer profile not found');
  }

  return sendSuccess(res, {
    message: 'Profile retrieved successfully',
    data: customerDto.customerResponse(customer)
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  customerValidators.validateUpdateProfile(req.body);
  const customer = await customerService.updateProfile(req.user.id, req.body);
  
  return sendSuccess(res, {
    message: 'Profile updated successfully',
    data: customerDto.customerResponse(customer)
  });
});

export const addAddress = catchAsync(async (req, res, next) => {
  customerValidators.validateAddAddress(req.body);
  const customer = await customerService.addAddress(req.user.id, req.body);

  return sendSuccess(res, {
    message: 'Address added successfully',
    data: customerDto.customerResponse(customer)
  });
});
