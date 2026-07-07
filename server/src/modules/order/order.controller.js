import { orderService } from './order.service.js';
import { orderValidators } from './order.validators.js';
import { orderDto } from './order.dto.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { AppError } from '../../utils/AppError.js';

export const createOrder = catchAsync(async (req, res) => {
  orderValidators.validateCreateOrder(req.body, true);

  const order = await orderService.placeOrder(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Order placed successfully',
    data: orderDto.orderResponse(order)
  });
});

export const lookupOrder = catchAsync(async (req, res) => {
  const { orderNumber, phone } = req.body;
  if (!orderNumber || !phone) {
    throw new AppError(400, 'Order number and phone number are required');
  }

  const order = await orderService.guestLookup(orderNumber, phone);

  return sendSuccess(res, {
    message: 'Order found',
    data: orderDto.orderResponse(order)
  });
});
