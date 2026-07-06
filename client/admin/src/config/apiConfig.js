export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
  },
  ORDERS: {
    LIST: '/orders/admin/list',
    DETAIL: (id) => `/orders/my-orders/${id}`,
    UPDATE_STATUS: (id) => `/orders/admin/status/${id}`,
    STATS: '/orders/admin/stats',
  },
  VOUCHERS: {
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
