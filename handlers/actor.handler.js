import actorModel from '../models/actor.model.js';

const handler = {};

handler.getListActors = async (req, res) => {
    const list = await actorModel.findAll();
    res.json(list);
};

handler.getActorById = async (req, res) => {
    const id = req.params.id || 0;
    const actor = await actorModel.findById(id);
    if (actor === null) {
        return res.status(204).end();
    }
    res.json(actor);
};

handler.postActor = async (req, res) => {
    let actor = req.body;

    const ret = await actorModel.add(actor);
    actor = {
        actor_id: ret[0],
        ...actor,
    };
    res.status(201).json(actor);
};

handler.patchActor = async (req, res) => {
    const id = req.params.id || 0;
    const actor = req.body;
    const n = await actorModel.patch(id, actor);
    res.json({
        affected: n,
    });
};

handler.deleteActor = async (req, res) => {
    const id = req.params.id || 0;
    const n = await actorModel.del(id);
    res.json({
        affected: n,
    });
};

export default handler;
