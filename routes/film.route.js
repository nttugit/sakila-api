import express from 'express';
const router = express.Router();
import filmHandler from '../handlers/film.handler.js';

router.get('/', filmHandler.getFilms);

router.get('/:id', filmHandler.getFilmById);

router.post('/', filmHandler.postFilm);

router.patch('/:id', filmHandler.patchFilm);

router.delete('/:id', filmHandler.deleteFilm);

export default router;
