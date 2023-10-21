import express from 'express';
import { readFile } from 'fs/promises';

const router = express.Router();
import actorHandler from '../handlers/actor.handler.js';
import validate from '../middlewares/validate.mdw.js';
import userAuth from '../middlewares/userAuth.mdw.js';

const schema = JSON.parse(
    await readFile(new URL('../schemas/actor.json', import.meta.url)),
);

// router.get('/', actorHandler.getListActors);
router.get('/', userAuth, actorHandler.getActors);
router.get('/:id', actorHandler.getActorById);
router.post('/', validate(schema), actorHandler.postActor);
router.patch('/:id', validate(schema), actorHandler.patchActor);
router.delete('/:id', actorHandler.deleteActor);

export default router;
