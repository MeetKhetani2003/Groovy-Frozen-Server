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
    return await model.findByIdAndDelete(id), { new: true };
  },
  updateById: async (id, data) => {
    const updated = await model.findByIdAndUpdate((id, data), { new: true });
    await model.save();
    return updated;
  }
});
