import express from 'express';
const router = express.Router();
import * as categoryModel from '../models/category.model.js';



router.get('/', async (req, res) => {
    const list = await categoryModel.findAll();
    res.json(list);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id || 0;
    const category = await categoryModel.findById(id);
    if (category === null) {
        return res.status(204).end();
    }
    res.json(category);
});

router.post('/', async (req, res) => {
    let category = req.body;

    const ret = await categoryModel.add(category);
    category = {
        category_id: ret[0],
        ...category
    }
    res.status(201).json(category);
});

router.patch('/:id', async(req, res) => {
    const id = req.params.id || 0;
    const category = req.body;
    const n = await categoryModel.patch(id,category);
    res.json({
        affected: n
    })
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id || 0;
    const n = await categoryModel.del(id);
    res.json({
        affected: n
    })
});


export default router;