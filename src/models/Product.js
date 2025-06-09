import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    stockQuantity: {
      type: Number,
      required: true
    },

    stockUnit: {
      type: String,
      required: true,
      enum: ['gram', 'kg', 'piece', 'packet', 'box']
    },
    packetQuantity: {
      type: Number,
      required: true
    },
    soldPackets: {
      type: Number,
      default: 0
    },
    packetUnit: {
      type: String,
      required: true,
      enum: ['gram', 'kg', 'piece', 'packet', 'box']
    },
    packetPrice: {
      type: Number,
      required: true
    },
    boxQuantity: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      // required: true
    },
    detailedImages: {
      type: [String],
      // required: true
    },
    packagingType: {
      type: String,
      required: true
    },
    friesType: {
      type: String,
      required: true
    },
    feature: {
      type: String,
      required: true
    },
    selfLife: {
      type: String,
      required: true
    },
    storageMethod: {
      type: String,
      required: true
    },
    temprature: {
      type: String,
      required: true
    },
    usageApplication: {
      type: String,
      required: true
    },
    refrigerationRequired: {
      type: Boolean,
      required: true
    },
    countryOfOrigin: {
      type: String,
      required: true
    },
    application: {
      type: String,
      required: true
    },
    frozenTemprature: {
      type: String,
      required: true
    },
    ingrediants: {
      type: String,
      required: true
    },
    form: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
