import { catalogService } from './catalog.service.js';
import { catalogValidators } from './catalog.validators.js';
import { catalogDto } from './catalog.dto.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { getPaginationOptions, buildPaginationMeta } from '../../utils/pagination.js';

// Public endpoints
export const listProducts = catchAsync(async (req, res, next) => {
  const pagination = getPaginationOptions(req.query);
  const filters = {
    categorySlug: req.query.category,
    search: req.query.search,
    minPrice: req.query.minPrice ? parseInt(req.query.minPrice, 10) : undefined,
    maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice, 10) : undefined
  };

  const { products, total } = await catalogService.queryProducts(filters, pagination);
  const meta = buildPaginationMeta(total, pagination.page, pagination.limit);

  return sendSuccess(res, {
    message: 'Products retrieved successfully',
    data: catalogDto.productListResponse(products),
    meta
  });
});

export const getProduct = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const product = await catalogService.getProductBySlug(slug);
  
  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      error: { statusCode: 404, message: 'Product not found' }
    });
  }

  return sendSuccess(res, {
    message: 'Product retrieved successfully',
    data: catalogDto.productResponse(product)
  });
});

export const listCategories = catchAsync(async (req, res, next) => {
  const includeInactive = req.user?.role === 'admin';
  const categories = await catalogService.getCategories(includeInactive);

  return sendSuccess(res, {
    message: 'Categories retrieved successfully',
    data: catalogDto.categoryListResponse(categories)
  });
});

// Admin endpoints
export const createProduct = catchAsync(async (req, res, next) => {
  catalogValidators.validateCreateProduct(req.body);
  const product = await catalogService.createProduct(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Product created successfully',
    data: catalogDto.productResponse(product)
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  catalogValidators.validateUpdateProduct(req.body);
  const product = await catalogService.updateProduct(req.params.id, req.body);

  return sendSuccess(res, {
    message: 'Product updated successfully',
    data: catalogDto.productResponse(product)
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  await catalogService.deleteProduct(req.params.id);
  
  return sendSuccess(res, {
    message: 'Product deleted successfully'
  });
});

export const createCategory = catchAsync(async (req, res, next) => {
  catalogValidators.validateCreateCategory(req.body);
  const category = await catalogService.createCategory(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Category created successfully',
    data: catalogDto.categoryResponse(category)
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const category = await catalogService.updateCategory(req.params.id, req.body);

  return sendSuccess(res, {
    message: 'Category updated successfully',
    data: catalogDto.categoryResponse(category)
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  await catalogService.deleteCategory(req.params.id);

  return sendSuccess(res, {
    message: 'Category deleted successfully'
  });
});
