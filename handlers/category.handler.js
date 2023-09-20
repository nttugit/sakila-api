import categoryModel from '../models/category.model.js';

const handler = {};

handler.getListCategories = async (req, res) => {
    const list = await categoryModel.findAll();
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
    const category = req.body;
    const n = await categoryModel.patch(id, category);
    res.json({
        affected: n,
    });
};

handler.deleteCategory = async (req, res) => {
    const id = req.params.id || 0;
    const n = await categoryModel.del(id);
    res.json({
        affected: n,
    });
};

export default handler;
