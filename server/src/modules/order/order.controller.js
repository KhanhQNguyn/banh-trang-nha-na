import { orderService } from './order.service.js';
import { orderValidators } from './order.validators.js';
import { orderDto } from './order.dto.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { AppError } from '../../utils/AppError.js';
import { getPaginationOptions, buildPaginationMeta } from '../../utils/pagination.js';

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

// Admin endpoints

export const listAllOrders = catchAsync(async (req, res) => {
  const pagination = getPaginationOptions(req.query);
  const filters = {};
  if (req.query.status) filters.status = req.query.status;

  const { orders, total } = await orderService.queryOrders(filters, pagination);
  const meta = buildPaginationMeta(total, pagination.page, pagination.limit);

  return sendSuccess(res, {
    message: 'Orders retrieved successfully',
    data: orderDto.orderListResponse(orders),
    meta
  });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const { status, cancelReason } = req.body;
  if (!status) throw new AppError(400, 'Target status is required');

  const order = await orderService.transitionStatus(
    req.params.id,
    status,
    req.user.id,
    cancelReason
  );

  return sendSuccess(res, {
    message: 'Order status updated successfully',
    data: orderDto.orderResponse(order)
  });
});

export const getDashboardStats = catchAsync(async (req, res) => {
  const todayOrderCount = await orderService.getOrderCountToday();
  const recentOrders = await orderService.getRecentOrders(5);

  return sendSuccess(res, {
    message: 'Stats retrieved',
    data: {
      todayOrderCount,
      recentOrders: orderDto.orderListResponse(recentOrders)
    }
  });
});
