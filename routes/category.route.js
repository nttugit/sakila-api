import express from 'express';
import { readFile } from 'fs/promises';
const router = express.Router();
import categoryHandler from '../handlers/category.handler.js';
import validate from '../middlewares/validate.mdw.js';
const schema = JSON.parse(
    await readFile(new URL('../schemas/category.json', import.meta.url)),
);

router.get('/', categoryHandler.getListCategories);
router.get('/:id', categoryHandler.getCategoryById);
router.post('/', validate(schema), categoryHandler.postCategory);
router.patch('/:id', validate(schema), categoryHandler.patchCategory);
router.delete('/:id', categoryHandler.deleteCategory);

export default router;
