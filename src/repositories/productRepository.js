import Product from '../models/Product.js';
import { curdRepository } from './curdRepository.js';

export const productRepository = {
  ...curdRepository(Product),
  getAllProductsPaginated: async (
    page,
    limit,
    { pricemin, pricemax, category, search, sortByPrice }
  ) => {
    const calculateSkip = (page, limit) => {
      return (page - 1) * limit;
    };

    const calculateTotalPages = async (limit, filters) => {
      const query = buildQuery(filters);
      const totalProducts = await Product.countDocuments(query);
      return Math.ceil(totalProducts / limit);
    };

    const buildQuery = (filters) => {
      const query = {};

      // Apply price filter only if the user has specified min or max
      if (filters.pricemin && filters.pricemax) {
        query.packetPrice = { $gte: filters.pricemin, $lte: filters.pricemax };
      } else if (filters.pricemin) {
        query.packetPrice = { $gte: filters.pricemin };
      } else if (filters.pricemax) {
        query.packetPrice = { $lte: filters.pricemax };
      }

      // Apply category filter only if specified
      if (filters.category) {
        query.category = filters.category;
      }

      // Apply search filter only if specified
      if (filters.search) {
        // Specifically search for the product name
        query.name = { $regex: filters.search, $options: 'i' }; // Case-insensitive search
      }

      return query;
    };

    // Build the query based on filters
    const query = buildQuery({ pricemin, pricemax, category, search });

    // Sort condition if price sorting is enabled
    const sortCondition = sortByPrice ? { packetPrice: sortByPrice } : {};

    // Fetch products based on the query and pagination
    const products = await Product.find(query)
      .skip(calculateSkip(page, limit))
      .limit(limit)
      .sort(sortCondition);

    // Calculate total pages for pagination
    const totalPages = await calculateTotalPages(limit, {
      pricemin,
      pricemax,
      category,
      search
    });

    return {
      products,
      totalPages,
      currentPage: page
    };
  },
  addStockQuantityRepository: async (id, quantity) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    product.stockQuantity += quantity;
    await product.save();
    return product;
  }
};


