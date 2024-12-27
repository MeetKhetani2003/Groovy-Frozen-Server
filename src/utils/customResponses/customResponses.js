import { StatusCodes } from 'http-status-codes';

/**
 * Success Response function
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Success message
 * @param {Object} data - Data to be sent in the response (default: null)
 */
export const successResponse = (
  res,
  statusCode = StatusCodes.OK,
  message = 'Success',
  data = null
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Error Response function
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string} error - Error type or category (e.g., 'Validation Error')
 * @param {string} message - Error message
 * @param {Object} details - Additional error details (default: null)
 */
export const errorResponse = (
  res,
  error,
  statusCode = 500,
  message = 'Something went wrong',
  detailedMessage = ''
) => {
  console.error(error); // Log the error in your server console

  return res.status(statusCode).json({
    success: false,
    message,
    error: detailedMessage || error.message || error
  });
};
