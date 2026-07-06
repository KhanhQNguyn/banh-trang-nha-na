import { voucherService } from './voucher.service.js';
import { voucherValidators } from './voucher.validators.js';
import { voucherDto } from './voucher.dto.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const validateVoucher = catchAsync(async (req, res, next) => {
  voucherValidators.validateValidateVoucher(req.body);
  const { code, orderTotal } = req.body;
  const userId = req.user?.id || null;

  const result = await voucherService.validateVoucher(code, orderTotal, userId);

  return sendSuccess(res, {
    message: 'Voucher is valid',
    data: result
  });
});

export const listVouchers = catchAsync(async (req, res, next) => {
  const includeInactive = req.user?.role === 'admin';
  const vouchers = await voucherService.getVouchers(includeInactive);

  return sendSuccess(res, {
    message: 'Vouchers retrieved successfully',
    data: voucherDto.voucherListResponse(vouchers)
  });
});

export const createVoucher = catchAsync(async (req, res, next) => {
  voucherValidators.validateCreateVoucher(req.body);
  const voucher = await voucherService.createVoucher(req.body);

  return sendSuccess(res, {
    statusCode: 211,
    message: 'Voucher created successfully',
    data: voucherDto.voucherResponse(voucher)
  });
});

export const updateVoucher = catchAsync(async (req, res, next) => {
  const voucher = await voucherService.updateVoucher(req.params.id, req.body);

  return sendSuccess(res, {
    message: 'Voucher updated successfully',
    data: voucherDto.voucherResponse(voucher)
  });
});

export const deleteVoucher = catchAsync(async (req, res, next) => {
  await voucherService.deleteVoucher(req.params.id);

  return sendSuccess(res, {
    message: 'Voucher deleted successfully'
  });
});
