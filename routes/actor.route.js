import express from 'express';
const router = express.Router();
import actorHandler from '../handlers/actor.handler.js';

router.get('/', actorHandler.getListActors);
router.get('/:id', actorHandler.getActorById);
router.post('/', actorHandler.postActor);
router.patch('/:id', actorHandler.patchActor);
router.delete('/:id', actorHandler.deleteActor);

export default router;
