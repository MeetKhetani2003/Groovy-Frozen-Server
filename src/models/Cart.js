import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1
      },
      packetCount: {},
      stockQuantity: {
        type: Number,
        default: 0
      },
      status: {
        type: String,
        enum: ['pending', 'checkedOut'],
        default: 'pending'
      },
      totalAmt: {
        type: Number,
        default: 0
      }
    }
  ],
  purchasedHistory: [
    {
      order: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
          },
          quantity: {
            type: Number,
            default: 1
          },

          totalAmt: {
            type: Number,
            default: 0
          },
          status: {
            type: String,
            default: 'checkedOut'
          }
        }
      ],
      checkoutAmt: {
        type: Number,
        default: 0
      }
    }
  ]
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
