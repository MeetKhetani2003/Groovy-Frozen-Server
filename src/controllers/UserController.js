import { StatusCodes } from 'http-status-codes';

import {
  forgotPassword,
  getAllUsersService,
  resetPassword,
  signinUser,
  signupUser,
  updateUserService,
  verifyOtp
} from '../services/userService.js';
import {
  errorResponse,
  successResponse
} from '../utils/customResponses/customResponses.js';
import ValidationError from '../utils/Errors/validationError.js';

export const signupController = async (req, res) => {
  try {
    const data = await signupUser(req.body);
    return successResponse(
      res,
      StatusCodes.OK,
      'User signed up successfully',
      data
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('Controller', error.message);

      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details
      });
    }
    return errorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      'Error occurred during user signup',
      error.details || []
    );
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return successResponse(
      res,
      StatusCodes.OK,
      'Users fetched successfully',
      users
    );
  } catch (error) {
    return errorResponse(
      res,
      error,
      500,
      'Internal Server Error',
      'An unexpected error occurred'
    );
  }
};
export const signinController = async (req, res) => {
  try {
    // Capture the result of signinUser, which includes token and user
    const { token, user } = await signinUser(req.body);

    // Pass the token and user to the successResponse
    return successResponse(res, StatusCodes.OK, 'User signed in successfully', {
      token,
      user
    });
  } catch (error) {
    // In case of an error, return the error response
    return errorResponse(
      res,
      error,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      'An unexpected error occurred'
    );
  }
};
export const forgotPasswordController = async (req, res) => {
  try {
    await forgotPassword(req.body);
    return successResponse(res, StatusCodes.OK, 'OTP sent to your email');
  } catch (error) {
    return errorResponse(
      res,
      error,
      500,
      'Internal Server Error',
      'An unexpected error occurred'
    );
  }
};

export async function verifyOtpController(req, res) {
  try {
    const result = await verifyOtp(req.body);
    console.log(result);

    return res
      .status(200)
      .json({ message: 'OTP verified successfully', data: result });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: err.message });
  }
}

export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const result = await resetPassword({ token, newPassword });
    return res.status(200).json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    return errorResponse(
      res,
      error,
      400,
      'Error resetting password',
      error.message
    );
  }
};

export const updateUserController = async (req, res) => {
  try {
    const id = req.user.user._id || req.user._id;
    const updatedUser = await updateUserService(id, req.body);
    console.log(id, req.body);

    return successResponse(
      res,
      StatusCodes.OK,
      'User updated successfully',
      updatedUser
    );
  } catch (error) {
    return errorResponse(
      res,
      error,
      500,
      'Internal Server Error',
      'An unexpected error occurred'
    );
  }
};
