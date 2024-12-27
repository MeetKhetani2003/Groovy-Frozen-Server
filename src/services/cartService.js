import { cartRepository } from '../repositories/CartRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import ValidationError from '../utils/Errors/validationError.js';

export const createCart = async () => {
  try {
    const cart = await cartRepository.create({
      userId: null,
      products: [],
      purchasedHistory: []
    });
    return cart;
  } catch (error) {
    throw new ValidationError(error.message);
  }
};

export const updateCartUser = async (cartId, data) => {
  try {
    const cart = await cartRepository.updateById(cartId, data);
    return cart;
  } catch (error) {
    throw new ValidationError(error.message);
  }
};


export const addProductToCartService = async (
  userId,
  productId,
  quantity,
  unitType = 'packet', // Default to packet
  status = 'pending'
) => {
  try {
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const cartId = cart.cart._id;
    const productDetails = await productRepository.getById(productId);

    if (!productDetails) {
      throw new Error('Product not found');
    }

    const stockQuantity =
      unitType === 'box'
        ? quantity * productDetails.boxQuantity
        : quantity * productDetails.packetQuantity;

    const subTotal =
      unitType === 'box'
        ? quantity * productDetails.boxQuantity * productDetails.packetPrice
        : quantity * productDetails.packetPrice;

    const products = [
      {
        productId,
        stockQuantity,
        quantity: Number(quantity),
        status,
        totalAmt: subTotal,
        unitType
      }
    ];

    const updatedCart = await cartRepository.addProductsToCartRepository({
      cartId,
      products
    });

    return updatedCart;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const checkoutCartService = async (cartId, data) => {
  try {
    const checkoutResult = await cartRepository.checkoutCartRepository(
      cartId,
      data
    );
    return {
      message: checkoutResult.message,
      purchasedProducts: checkoutResult.purchasedProducts,
      subtotal: checkoutResult.subtotal
    };
  } catch (error) {
    console.log(error);

    throw new Error(error.message);
  }
};

export const getCartService = async (id) => {
  try {
    const cart = await cartRepository.getCartByCartId(id);
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  } catch (error) {
    throw new ValidationError(error.message);
  }
};
