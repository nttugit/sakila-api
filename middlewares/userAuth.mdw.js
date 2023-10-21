import userModel from '../models/user.model.js';
import { verifyToken } from '../utils/auth.js';

export default async (req, res, next) => {
    // Lấy access token từ header
    const authorizationHeader = req.headers['authorization'];
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
        return res.status(401).send('Không tìm thấy access token!');
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const verified = await verifyToken(accessToken, accessTokenSecret);
    if (!verified) {
        return res
            .status(401)
            .json({ error: 'Bạn không có quyền truy cập vào tính năng này!' });
    }

    const user = await userModel.findOne({
        username: verified.payload.username,
    });
    req.user = user;

    return next();
};
