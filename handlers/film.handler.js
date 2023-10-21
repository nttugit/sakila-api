import axios from 'axios';
import crypto from 'crypto';
import filmModel from '../models/film.model.js';
const handler = {};

handler.getAllFilms = async (req, res) => {
    const list = await filmModel.findAll();
    res.json(list);
};

function generateToken(url, timestamp) {
    console.log({
        url,
        timestamp,
        SECRET_KEY: process.env.SECRET_KEY,
    });
    return crypto
        .createHash('sha256')
        .update(url + timestamp + process.env.SECRET_KEY)
        .digest('hex');
}

handler.getFilms = async (req, res) => {
    // Không có data, phải call qua server b
    // const conditions = {};
    // const { page = 1, size = 10 } = req.query;
    // const list = await filmModel.find({ page, size }, conditions);

    const apiUrl = 'http://localhost:3001/api/films';
    const timestamp = new Date().getTime();
    const token = generateToken(apiUrl, timestamp);

    // time tạo token và time gọi API khác nhau

    const queryParameters = `?token=${token}&timestamp=${timestamp}`;
    const fullApiUrl = apiUrl + queryParameters;
    console.log(fullApiUrl);

    try {
        const response = await axios.get(fullApiUrl);
        return res.status(200).json(response.data);
    } catch (err) {
        // console.log(err);
        return res.status(400).json({ err: 'you dont know anything' });
    }
    // res.json(data);
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
