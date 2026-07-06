export class AppError extends Error {
  constructor(statusCode, message, cause = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.cause = cause;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
