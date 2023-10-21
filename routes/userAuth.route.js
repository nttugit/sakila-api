import express from 'express';
import { readFile } from 'fs/promises';

const router = express.Router();
import userAuthHandler from '../handlers/userAuth.handler.js';
import validate from '../middlewares/validate.mdw.js';

const schema = JSON.parse(
    await readFile(new URL('../schemas/user.json', import.meta.url)),
);

router.post('/login', validate(schema), userAuthHandler.login);
router.post('/register', validate(schema), userAuthHandler.register);
router.post('/refresh', userAuthHandler.refreshToken);
export default router;
