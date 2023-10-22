import userModel from '../models/user.model.js';
import { verifyToken } from '../utils/auth.js';
import RESPONSE from '../constants/response.js';

export default async (req, res, next) => {
    // Lấy access token từ header
    const authorizationHeader = req.headers['authorization'];
    const accessToken = authorizationHeader?.split(' ')[1];
    if (!accessToken) {
        return res.status(401).json(RESPONSE.FAILURE(401, 'Access denied'));
    }

    // Verify token
    const verified = await verifyToken(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
    );
    console.log('verified', verified);
    if (!verified)
        return res.status(401).json(RESPONSE.FAILURE(401, 'Access denied'));

    const user = await userModel.findOne({
        username: verified.payload.username,
    });
    req.user = user;

    return next();
};
