import express from 'express';
import { readFile } from 'fs/promises';
const router = express.Router();
import filmHandler from '../handlers/film.handler.js';
import validate from '../middlewares/validate.mdw.js';

const schema = JSON.parse(
    await readFile(new URL('../schemas/film.json', import.meta.url)),
);

router.get('/', filmHandler.getFilms);
router.get('/:id', filmHandler.getFilmById);
router.post('/', validate(schema), filmHandler.postFilm);
router.patch('/:id', validate(schema), filmHandler.patchFilm);
router.delete('/:id', filmHandler.deleteFilm);

export default router;
