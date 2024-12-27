import express from 'express';

import upload from '../../configs/multerConfig.js'; // Adjust the path as necessary
import {
  addStockQuantityController,
  createProductController,
  deleteProductController,
  getAllProductsController,
  getAllProductsPaginatedController,
  getSingleProductController,
  updateProductController
} from '../../controllers/ProductController.js'; // Adjust the path as necessary

const app = express.Router();

const uploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'detailedImages', maxCount: 5 }
]);

app.post('/create', uploadFields, createProductController);
app.get('/getall', getAllProductsController);
app.get('/', getAllProductsPaginatedController);
app.get('/get/:id', getSingleProductController);
app.put('/update/:id', uploadFields, updateProductController);
app.put('/addStock/:id', addStockQuantityController);
app.delete('/delete/:id', deleteProductController);
export default app;
