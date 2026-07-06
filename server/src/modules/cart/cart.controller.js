import { cartService } from './cart.service.js';
import { cartValidators } from './cart.validators.js';
import { cartDto } from './cart.dto.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const getCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.getCart(req.user.id);
  
  return sendSuccess(res, {
    message: 'Cart retrieved successfully',
    data: cartDto.cartResponse(cart)
  });
});

export const addItem = catchAsync(async (req, res, next) => {
  cartValidators.validateAddToCart(req.body);
  const cart = await cartService.addItem(req.user.id, req.body);

  return sendSuccess(res, {
    message: 'Item added to cart successfully',
    data: cartDto.cartResponse(cart)
  });
});

export const updateQuantity = catchAsync(async (req, res, next) => {
  cartValidators.validateUpdateQuantity(req.body);
  const cart = await cartService.updateQuantity(req.user.id, req.params.itemId, req.body.quantity);

  return sendSuccess(res, {
    message: 'Cart item quantity updated successfully',
    data: cartDto.cartResponse(cart)
  });
});

export const removeItem = catchAsync(async (req, res, next) => {
  const cart = await cartService.removeItem(req.user.id, req.params.itemId);

  return sendSuccess(res, {
    message: 'Item removed from cart successfully',
    data: cartDto.cartResponse(cart)
  });
});

export const clearCart = catchAsync(async (req, res, next) => {
  await cartService.clearCart(req.user.id);

  return sendSuccess(res, {
    message: 'Cart cleared successfully',
    data: { items: [], totalItems: 0, totalAmount: 0 }
  });
});
