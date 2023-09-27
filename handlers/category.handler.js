import categoryModel from '../models/category.model.js';

const handler = {};

handler.getAllCategories = async (req, res) => {
    const list = await categoryModel.findAll();
    res.json(list);
};

handler.getCategories = async (req, res) => {
    const conditions = {};
    const { page = 1, size = 10 } = req.query;
    const list = await categoryModel.find({ page, size }, conditions);
    res.json(list);
};

handler.getCategoryById = async (req, res) => {
    const id = req.params.id || 0;
    const category = await categoryModel.findById(id);
    if (category === null) {
        return res.status(204).end();
    }
    res.json(category);
};

handler.postCategory = async (req, res) => {
    let category = req.body;

    const ret = await categoryModel.add(category);
    category = {
        category_id: ret[0],
        ...category,
    };
    res.status(201).json(category);
};

handler.patchCategory = async (req, res) => {
    const id = req.params.id || 0;
    const found = await categoryModel.findById(id);
    if (found === null) {
        return res.status(204).end();
    }
    const category = req.body;
    const n = await categoryModel.patch(id, category);
    res.json({
        affected: n,
    });
};

handler.deleteCategory = async (req, res) => {
    const id = req.params.id || 0;
    const found = await categoryModel.findById(id);
    if (found === null) {
        return res.status(204).end();
    }
    const n = await categoryModel.del(id);
    res.json({
        affected: n,
    });
};

export default handler;
