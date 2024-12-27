import { StatusCodes } from 'http-status-codes';

import {
  addStockQuantityService,
  createProductService,
  deleteProductService,
  getAllProductsService,
  getSingleProductService,
  updateProductService
} from '../services/productServices.js';
import {
  errorResponse,
  successResponse
} from '../utils/customResponses/customResponses.js';

export const createProductController = async (req, res) => {
  try {
    const data = req.body;
    const thumbnail = req.files['thumbnail']
      ? req.files['thumbnail'][0].path
      : null;
    const detailedImages = req.files['detailedImages'].map((file) => file.path);
    console.log(
      'Thumbnail',
      thumbnail,
      'DetailedImgs',
      detailedImages,
      'Data',
      req.body
    );

    if (!thumbnail) {
      return res
        .status(400)
        .json({ success: false, message: 'Thumbnail is required' });
    }

    const productData = {
      ...data,
      thumbnail,
      detailedImages
    };

    const product = await createProductService(productData);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};
export const getAllProductsPaginatedController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    console.log(req.query);

    const products = await getAllProductsService(page, limit, req.query);
    return successResponse(
      res,
      StatusCodes.OK,
      'Products fetched successfully',
      products
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

export const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProductsService();
    return successResponse(
      res,
      StatusCodes.OK,
      'Products fetched successfully',
      products
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
export const getSingleProductController = async (req, res) => {
  try {
    const product = await getSingleProductService(req.params.id);
    return successResponse(
      res,
      StatusCodes.OK,
      'Product fetched successfully',
      product
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

export const updateProductController = async (req, res) => {
  try {
    const product = await updateProductService(
      req.params.id,
      req.body,
      req.files
    );
    return successResponse(
      res,
      StatusCodes.OK,
      'Product updated successfully',
      product
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

export const deleteProductController = async (req, res) => {
  try {
    const product = await deleteProductService(req.params.id);
    return successResponse(
      res,
      StatusCodes.OK,
      'Product deleted successfully',
      product
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

export const addStockQuantityController = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity); // Explicitly parse to Number
    if (isNaN(quantity)) {
      return errorResponse(
        res,
        null,
        400,
        'Bad Request',
        'Quantity must be a number'
      );
    }

    const product = await addStockQuantityService(req.params.id, quantity);
    return successResponse(
      res,
      StatusCodes.OK,
      'Product updated successfully',
      product
    );
  } catch (error) {
    console.log('Controller', error);

    return errorResponse(
      res,
      error,
      500,
      'Internal Server Error',
      'An unexpected error occurred'
    );
  }
};
