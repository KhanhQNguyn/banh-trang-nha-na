import { AppError } from '../utils/AppError.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error stack for debugging in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error stack:', err);
  }

  // Normalize specific error types
  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    error = new AppError(400, `Invalid value for path: ${err.path}`);
  }

  // 2. Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue).join(', ');
    error = new AppError(400, `Duplicate field value for: ${fields}. Please use another value.`);
  }

  // 3. Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join('. ');
    error = new AppError(400, `Validation Error: ${message}`, err.errors);
  }

  // 4. JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError(401, 'Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError(401, 'Your token has expired. Please log in again.', 'JWT_EXPIRED');
  }

  // 5. Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError(400, 'File too large. Max size is 5MB.');
  }

  // Send standardized error envelope
  res.status(error.statusCode).json({
    success: false,
    error: {
      statusCode: error.statusCode,
      message: error.message || 'Internal Server Error',
      cause: error.cause || null
    }
  });
};
