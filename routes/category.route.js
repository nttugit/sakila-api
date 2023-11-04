import express from 'express';
import { readFile } from 'fs/promises';
const router = express.Router();
import categoryHandler from '../handlers/category.handler.js';
import validate from '../middlewares/validate.mdw.js';
const schema = JSON.parse(
    await readFile(new URL('../schemas/category.json', import.meta.url)),
);

// router.get('/', categoryHandler.getCategories);
router.get('/', categoryHandler.getAllCategories);

// SHORT POLLING
router.get('/sp', categoryHandler.getAllCategoriesShortPolling);

// LONG POLLING
router.get('/lp', categoryHandler.getAllCategoriesLongPolling);

router.get('/:id', categoryHandler.getCategoryById);

// WEB SOCKET
// router.post('/', validate(schema), categoryHandler.postCategory);

// SSE
router.post('/', validate(schema), categoryHandler.postCategorySSE);
router.patch('/:id', validate(schema), categoryHandler.patchCategory);
router.delete('/:id', categoryHandler.deleteCategory);

export default router;
