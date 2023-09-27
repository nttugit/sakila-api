import filmModel from '../models/film.model.js';

const handler = {};

handler.getAllFilms = async (req, res) => {
    const list = await filmModel.findAll();
    res.json(list);
};

handler.getFilms = async (req, res) => {
    const conditions = {};
    const { page = 1, size = 10 } = req.query;
    const list = await filmModel.find({ page, size }, conditions);
    res.json(list);
};

handler.getFilmById = async (req, res) => {
    const id = req.params.id || 0;
    const film = await filmModel.findById(id);
    if (film === null) {
        return res.status(204).end();
    }
    res.json(film);
};

handler.postFilm = async (req, res) => {
    let film = req.body;

    const ret = await filmModel.add(film);
    film = {
        film_id: ret[0],
        ...film,
    };
    res.status(201).json(film);
};

handler.patchFilm = async (req, res) => {
    const id = req.params.id || 0;
    const found = await filmModel.findById(id);
    if (found === null) {
        return res.status(204).end();
    }
    const film = req.body;
    const n = await filmModel.patch(id, film);
    res.json({
        affected: n,
    });
};

handler.deleteFilm = async (req, res) => {
    const id = req.params.id || 0;
    const found = await filmModel.findById(id);
    if (found === null) {
        return res.status(204).end();
    }
    const n = await filmModel.del(id);
    res.json({
        affected: n,
    });
};

export default handler;
