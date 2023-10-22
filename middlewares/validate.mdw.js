import Ajv from 'ajv';
import RESPONSE from '../constants/response.js';

export default function (schema) {
    return function validate(req, res, next) {
        const ajv = new Ajv();

        const valid = ajv.validate(schema, req.body);
        if (!valid) {
            return res.status(400).json(RESPONSE.FAILURE(400, ajv.errors));
        }

        next();
    };
}
