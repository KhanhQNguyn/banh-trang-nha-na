export const API = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  CUSTOMERS: {
    ME: '/customers/me',
    ADDRESSES: '/customers/addresses',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (slug) => `/products/${slug}`,
    FEATURED: '/products?isFeatured=true',
    SEARCH: '/products',
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (slug) => `/categories/${slug}`,
  },
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (itemId) => `/cart/items/${itemId}`,
    REMOVE_ITEM: (itemId) => `/cart/items/${itemId}`,
    CLEAR: '/cart',
  },
  ORDERS: {
    PLACE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    MY_ORDER_DETAIL: (id) => `/orders/my-orders/${id}`,
    LOOKUP: '/orders/lookup',
    // Admin
    ADMIN_LIST: '/orders/admin/list',
    ADMIN_STATUS: (id) => `/orders/admin/status/${id}`,
    ADMIN_STATS: '/orders/admin/stats',
  },
  VOUCHERS: {
    VALIDATE: '/vouchers/validate',
    // Admin
    LIST: '/vouchers',
    CREATE: '/vouchers',
    UPDATE: (id) => `/vouchers/${id}`,
    DELETE: (id) => `/vouchers/${id}`,
  },
  MEDIA: {
    UPLOAD: '/media/upload',
    DELETE: (publicId) => `/media/${publicId}`,
  },
};
