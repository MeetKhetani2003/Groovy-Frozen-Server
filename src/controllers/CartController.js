import {
  addProductToCartService,
  checkoutCartService,
  getCartService
} from '../services/cartService.js';

export const addProductToCartController = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user._id || req.user.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.'
      });
    }
    const { productId } = req.params; // Extract productId correctly
    const { quantity } = req.body;

    console.log(productId, quantity);

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required.'
      });
    }

    const updatedCart = await addProductToCartService(
      userId,
      productId, // Pass the string value
      quantity
    );

    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully.',
      cart: updatedCart
    });
  } catch (error) {
    console.log(error);

    console.error('Error adding product to cart:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong.'
    });
  }
};

export const checkoutCartController = async (req, res) => {
  try {
    const cartId = req.user.cart;
    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: 'Cart ID is required.'
      });
    }
    console.log(req.body, cartId);

    const result = await checkoutCartService(cartId, req.body);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error checking out cart:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong'
    });
  }
};

export const getCartController = async (req, res) => {
  try {
    const cart = await getCartService(req.params.id);
    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong'
    });
  }
};
