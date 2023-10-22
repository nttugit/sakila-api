import actorModel from '../models/actor.model.js';
import RESPONSE from '../constants/response.js';

const handler = {};

handler.getListActors = async (req, res) => {
    const list = await actorModel.findAll();
    res.json(list);
};

handler.getActors = async (req, res) => {
    const conditions = {};
    const { page = 1, size = 10 } = req.query;
    const [list, totalItems] = await Promise.all([
        actorModel.find({ page, size }, conditions),
        actorModel.count(conditions),
    ]);

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

handler.getActorById = async (req, res) => {
    const id = req.params.id || 0;
    const actor = await actorModel.findById(id);
    if (actor === null) {
        return res.status(204).end();
    }
    res.status(200).json(RESPONSE.SUCCESS(actor, 'get successfully', null));
};

handler.postActor = async (req, res) => {
    let actor = req.body;

    const ret = await actorModel.add(actor);
    actor = {
        actor_id: ret[0],
        ...actor,
    };
    res.status(201).json(RESPONSE.SUCCESS(actor, 'created', null));
};

handler.patchActor = async (req, res) => {
    const id = req.params.id || 0;
    const found = await actorModel.findById(id);
    if (found === null) {
        return res.status(400).json(RESPONSE.FAILURE(400, 'actor not found'));
    }
    const actor = req.body;
    const affectedRecords = await actorModel.patch(id, actor);
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

handler.deleteActor = async (req, res) => {
    const id = req.params.id || 0;
    const found = await actorModel.findById(id);
    if (found === null) {
        return res.status(400).json(RESPONSE.FAILURE(400, 'actor not found'));
    }
    const affectedRecords = await actorModel.del(id);
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

export default handler;
