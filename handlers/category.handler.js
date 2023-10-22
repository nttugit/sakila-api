import categoryModel from '../models/category.model.js';
import RESPONSE from '../constants/response.js';

const handler = {};

handler.getAllCategories = async (req, res) => {
    const list = await categoryModel.findAll();
    res.status(200).json(RESPONSE.SUCCESS(list, 'get successfully', null));
};

handler.getCategories = async (req, res) => {
    const conditions = {};
    const { page = 1, size = 10 } = req.query;
    const list = await categoryModel.find({ page, size }, conditions);
    const totalItems = await categoryModel.count(conditions);
    res.status(200).json(
        RESPONSE.SUCCESS(list, 'get successfully', {
            pagination: {
                totalItems: totalItems['count(*)'], // Total number of items available
                itemsPerPage: size, // Number of items per page
                currentPage: page, // The current page being returned
                totalPages: Math.ceil(totalItems['count(*)'] / size),
            },
        }),
    );
};

handler.getCategoryById = async (req, res) => {
    const id = req.params.id || 0;
    const category = await categoryModel.findById(id);
    if (category === null) {
        return res.status(204).end();
    }
    res.status(200).json(RESPONSE.SUCCESS(category, 'get successfully', null));
};

handler.postCategory = async (req, res) => {
    let category = req.body;

    const ret = await categoryModel.add(category);
    category = {
        category_id: ret[0],
        ...category,
    };
    res.status(200).json(RESPONSE.SUCCESS(category, 'created', null));
};

handler.patchCategory = async (req, res) => {
    const id = req.params.id || 0;
    const found = await categoryModel.findById(id);
    if (found === null) {
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'category not found'));
    }
    const category = req.body;
    const affectedRecords = await categoryModel.patch(id, category);

    res.status(200).json(
        RESPONSE.SUCCESS(
            {
                affected: affectedRecords,
            },
            'updated',
            null,
        ),
    );
};

handler.deleteCategory = async (req, res) => {
    const id = req.params.id || 0;
    const found = await categoryModel.findById(id);
    // Không repond lỗi 204
    if (found === null) {
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'category not found'));
    }
    const affectedRecords = await categoryModel.del(id);
    res.status(200).json(
        RESPONSE.SUCCESS(
            {
                affected: affectedRecords,
            },
            'deleted',
            null,
        ),
    );
};

export default handler;
