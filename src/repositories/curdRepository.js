import mongoose from 'mongoose';

export const curdRepository = (model) => ({
  create: async (data) => {
    return await model.create(data);
  },

  getById: async (id) => {
    return await model.findById(id);
  },

  getOne: async (query) => {
    return await model.findOne(query);
  },

  getAll: async () => {
    return await model.find();
  },

  deleteById: async (id) => {
    return await model.findByIdAndDelete(id); // Removed incorrect { new: true }
  },

  updateById: async (id, data) => {
    try {
      console.log('updateById - ID:', id); // Debug log
      console.log('updateById - Updates:', data); // Debug log

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const updated = await model.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!updated) {
        throw new Error('Document not found');
      }

      return updated;
    } catch (error) {
      console.error('Error in updateById:', error);
      throw error;
    }
  }
});
