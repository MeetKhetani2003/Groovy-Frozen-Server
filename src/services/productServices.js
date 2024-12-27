import { cloudinaryInstance } from '../configs/cloudinaryConfig.js';
import { productRepository } from '../repositories/productRepository.js';
import ValidationError from '../utils/Errors/validationError.js';

export const createProductService = async (data) => {
  try {
    const existingProduct = await productRepository.getOne({ name: data.name });
    if (existingProduct) {
      throw new ValidationError(
        'Product already exists. Please update its stock instead.'
      );
    }
    const product = await productRepository.create(data);
    return product;
  } catch (error) {
    throw new ValidationError(error.message);
  }
};

export const getAllProductsService = async (page, limit, filters) => {
  try {
    const defaultFilters = filters || {};
    if (!defaultFilters.pricemin && !defaultFilters.pricemax) {
      defaultFilters.priceMin = 0;
    }
    if (!defaultFilters.sortByPrice) {
      defaultFilters.sortByPrice = 1;
    }
    const products = await productRepository.getAllProductsPaginated(
      page,
      limit,
      defaultFilters
    );
    return products;
  } catch (error) {
    throw new ValidationError(error.message);
  }
};

export const getAllProductsWithoutPaginationService = async () => {
  try {
    const products = await productRepository.getAll();
    return products;
  } catch (error) {
    throw new ValidationError(error.message);
  }
};
export const getSingleProductService = async (id) => {
  try {
    const product = await productRepository.getById(id);
    if (!product) {
      throw new ValidationError('Product not found');
    }
    return product;
  } catch (error) {
    throw new ValidationError(error.message);
  }
};

export const addStockQuantityService = async (id, quantity) => {
  try {
    const product = await productRepository.addStockQuantityRepository(
      id,
      quantity
    );
    if (!product) {
      throw new ValidationError('Product not found');
    }
    return product;
  } catch (error) {
    console.log('Service', error);

    throw new ValidationError(error.message);
  }
};
const extractPublicId = (url) => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1].split('.')[0];
  return `${parts[parts.length - 2]}/${fileName}`;
};
export const updateProductService = async (id, data, files) => {
  try {
    console.log(files);

    // Fetch the existing product to handle old images
    const existingProduct = await productRepository.getById(id);
    if (!existingProduct) {
      throw new ValidationError('Product not found');
    }

    const updates = { ...data };

    // Handle thumbnail update
    if (files.thumbnail && files.thumbnail[0]) {
      // Delete the existing thumbnail
      if (existingProduct.thumbnail) {
        const publicId = extractPublicId(existingProduct.thumbnail);
        await cloudinaryInstance.uploader.destroy(publicId);
      }
      // Save new thumbnail URL
      updates.thumbnail = files.thumbnail[0].path; // Cloudinary auto-generates the URL
    }

    // Handle detailed images update
    if (files.detailedImages && files.detailedImages.length > 0) {
      // Delete existing detailed images
      if (
        existingProduct.detailedImages &&
        existingProduct.detailedImages.length > 0
      ) {
        await Promise.all(
          existingProduct.detailedImages.map((imgUrl) => {
            const publicId = extractPublicId(imgUrl);
            return cloudinaryInstance.uploader.destroy(publicId);
          })
        );
      }
      // Save new detailed images URLs
      updates.detailedImages = files.detailedImages.map((file) => file.path); // Cloudinary auto-generates URLs
    }

    // Update the product in the database
    await productRepository.updateById(id, updates);
    return {
      success: true,
      message: 'Product updated successfully',
      product: updates
    };
  } catch (error) {
    console.log(error);

    throw new ValidationError(error.message);
  }
};

export const deleteProductService = async (id) => {
  try {
    // Fetch the product to delete its associated images
    const product = await productRepository.getById(id);
    console.log(product);
    if (!product) {
      throw new ValidationError('Product not found');
    }

    // Delete thumbnail from Cloudinary
    if (product.thumbnail) {
      const thumbnailPublicId = extractPublicId(product.thumbnail);
      await cloudinaryInstance.uploader.destroy(thumbnailPublicId);
    }

    if (product.detailedImages && product.detailedImages.length > 0) {
      await Promise.all(
        product.detailedImages.map(async (imgUrl) => {
          const publicId = extractPublicId(imgUrl);
          try {
            await cloudinaryInstance.uploader.destroy(publicId);
          } catch (error) {
            throw new ValidationError(error.message);
          }
        })
      );
    }
    await productRepository.deleteById(id);
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    throw new ValidationError(error.message);
  }
};
