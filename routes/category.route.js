import express from 'express';
const router = express.Router();
import categoryHandler from '../handlers/category.handler.js';

router.get('/', categoryHandler.getListCategories);

router.get('/:id', categoryHandler.getCategoryById);

router.post('/', categoryHandler.postCategory);

router.patch('/:id', categoryHandler.patchCategory);

router.delete('/:id', categoryHandler.deleteCategory);

export default router;
