// import { instance } from '../index.js';

import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { curdRepository } from './curdRepository.js';

export const cartRepository = {
  ...curdRepository(Cart),
  getCartByUserId: async (userId) => {
    const cart = await User.findById(userId).populate('cart');
    return cart;
  },
  getCartByCartId: async (id) => {
    const cart = await Cart.findById(id)
      .populate({
        path: 'products',
        populate: {
          path: 'productId'
        }
      })
      .populate({
        path: 'purchasedHistory',
        populate: {
          path: 'order',
          populate: {
            path: 'productId'
          }
        }
      });
    return cart;
  },
  addProductsToCartRepository: async ({ cartId, products }) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    for (const product of products) {
      const existingProductIndex = cart.products.findIndex(
        (p) => p.productId.toString() === product.productId
      );

      if (existingProductIndex > -1) {
        // Update existing product
        cart.products[existingProductIndex].quantity += Number(
          product.quantity
        );
        cart.products[existingProductIndex].stockQuantity += Number(
          product.stockQuantity
        );
        cart.products[existingProductIndex].status = product.status;
        cart.products[existingProductIndex].totalAmt += Number(
          product.totalAmt
        );
        cart.products[existingProductIndex].unitType = product.unitType; // packet or box
      } else {
        // Add new product
        cart.products.push({
          productId: product.productId,
          quantity: Number(product.quantity),
          stockQuantity: Number(product.stockQuantity),
          status: product.status,
          totalAmt: Number(product.totalAmt),
          unitType: product.unitType // New field
        });
      }
    }

    // Calculate cart totals
    cart.totalAmt = cart.products.reduce((acc, item) => acc + item.totalAmt, 0);
    cart.totalQuantity = cart.products.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    await cart.save();
    return cart;
  },

  checkoutCartRepository: async (cartId, data) => {
    try {
      console.log('data', data);

      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const updatedProducts = new Set();

      for (const item of data.products) {
        const cartProductIndex = cart.products.findIndex(
          (product) => product.productId.toString() === item.productId
        );

        console.log('cartProductIndex', cartProductIndex);
        console.log('item', item);

        if (!updatedProducts.has(item.productId)) {
          updatedProducts.add(item.productId);
          const updateProductStock = async (productId, quantity) => {
            try {
              const product = await Product.findById(productId);
              if (!product) {
                throw new Error('Product not found');
              }
              const decrementAmount = quantity * product.packetQuantity;

              const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                  $inc: {
                    stockQuantity: -decrementAmount,
                    soldPackets: quantity
                  }
                },
                { new: true, runValidators: true }
              );

              return { success: true, product: updatedProduct };
            } catch (error) {
              console.error(`Error updating product stock: ${error.message}`);
              throw error;
            }
          };

          await updateProductStock(item.productId, item.quantity);
        }

        if (cartProductIndex > -1) {
          cart.products[cartProductIndex].quantity = item.quantity;
          cart.products[cartProductIndex].totalAmt = item.totalAmt;
          cart.products[cartProductIndex].status = 'checkedOut';
        }
      }

      const purchasedOrder = {
        order: data.products.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          totalAmt: item.totalAmt
        })),
        checkoutAmt: data.totalAmt
      };

      cart.purchasedHistory.push(purchasedOrder);
      cart.products = [];

      await cart.save();

      return {
        message: 'Checkout successful',
        purchasedProducts: purchasedOrder,
        subtotal: data.totalAmt
      };
    } catch (error) {
      console.error('Error in checkoutCartRepository:', error.message);
      throw new Error('Checkout process failed.');
    }
  }
};
