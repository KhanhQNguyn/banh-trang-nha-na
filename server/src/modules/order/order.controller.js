import { orderService } from './order.service.js';
import { orderValidators } from './order.validators.js';
import { orderDto } from './order.dto.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { getPaginationOptions, buildPaginationMeta } from '../../utils/pagination.js';
import { AppError } from '../../utils/AppError.js';

export const createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user?.id || null;
  const isGuest = !userId;

  orderValidators.validateCreateOrder(req.body, isGuest);
  
  const order = await orderService.placeOrder(userId, req.body);

  return sendSuccess(res, {
    statusCode: 211,
    message: 'Order placed successfully',
    data: orderDto.orderResponse(order)
  });
});

export const getMyOrders = catchAsync(async (req, res, next) => {
  const pagination = getPaginationOptions(req.query);
  const filters = { userId: req.user.id };

  const { orders, total } = await orderService.queryOrders(filters, pagination);
  const meta = buildPaginationMeta(total, pagination.page, pagination.limit);

  return sendSuccess(res, {
    message: 'Orders retrieved successfully',
    data: orderDto.orderListResponse(orders),
    meta
  });
});

export const getOrderDetails = catchAsync(async (req, res, next) => {
  const order = await orderService.getOrderById(req.params.id);
  if (!order) throw new AppError(404, 'Order not found');

  // Verify ownership
  if (req.user.role !== 'admin' && order.userId?.toString() !== req.user.id) {
    throw new AppError(403, 'Access denied. You do not own this order.');
  }

  return sendSuccess(res, {
    message: 'Order retrieved successfully',
    data: orderDto.orderResponse(order)
  });
});

export const lookupOrder = catchAsync(async (req, res, next) => {
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

// Admin-only endpoints
export const listAllOrders = catchAsync(async (req, res, next) => {
  const pagination = getPaginationOptions(req.query);
  const filters = {};

  if (req.query.status) {
    filters.status = req.query.status;
  }

  const { orders, total } = await orderService.queryOrders(filters, pagination);
  const meta = buildPaginationMeta(total, pagination.page, pagination.limit);

  return sendSuccess(res, {
    message: 'All orders retrieved successfully',
    data: orderDto.orderListResponse(orders),
    meta
  });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, cancelReason } = req.body;
  if (!status) throw new AppError(400, 'Target status is required');

  const order = await orderService.transitionStatus(
    req.params.id,
    status,
    req.user.id,
    req.user.role,
    cancelReason
  );

  return sendSuccess(res, {
    message: 'Order status updated successfully',
    data: orderDto.orderResponse(order)
  });
});

export const getDashboardStats = catchAsync(async (req, res, next) => {
  const orderCount = await orderService.getOrderCountToday();
  const recentOrders = await orderService.getRecentOrders(5);

  return sendSuccess(res, {
    message: 'Stats retrieved',
    data: {
      todayOrderCount: orderCount,
      recentOrders: orderDto.orderListResponse(recentOrders)
    }
  });
});
