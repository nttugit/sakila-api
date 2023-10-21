import bcrypt from 'bcrypt';
// import randToken from 'rand-token';
import userModel from '../models/user.model.js';
import refreshTokenModel from '../models/refreshToken.model.js';
import { generateToken, decodeToken } from '../utils/auth.js';
const handler = {};
const saltRounds = 10;

handler.login = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    const user = await userModel.findOne({ username });
    if (!user) {
        return res.status(401).json({ error: 'Tên đăng nhập không tồn tại.' });
    }

    // console.log('found user', user);

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Mật khẩu không chính xác.' });
    }

    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;

    const dataForAccessToken = {
        username: user.username,
    };
    const accessToken = generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );
    if (!accessToken) {
        return res
            .status(401)
            .send('Đăng nhập không thành công, vui lòng thử lại.');
    }

    let refreshToken = null;
    const userRefreshToken = await refreshTokenModel.findById(user.username);

    if (!userRefreshToken?.refresh_token) {
        refreshToken = generateToken(
            dataForAccessToken,
            refreshTokenSecret,
            refreshTokenLife,
        );
        // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
        await refreshTokenModel.add({
            refresh_token_id: user.username,
            refresh_token: refreshToken,
        });
    } else {
        // Nếu user này đã có refresh token thì lấy refresh token đó từ database
        refreshToken = userRefreshToken.refresh_token;
    }

    return res.json({
        msg: 'Đăng nhập thành công.',
        accessToken,
        refreshToken,
        user: {
            user_id: user.user_id,
            username: user.username,
        },
    });
};

handler.register = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const user = await userModel.findOne({ username });
    if (user) res.status(400).json({ error: 'Tên tài khoản đã tồn tại.' });
    else {
        const hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
        const newUser = {
            username: username,
            password: hashPassword,
        };
        const createUser = await userModel.add(newUser);
        if (!createUser) {
            return res
                .status(400)
                .send(
                    'Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.',
                );
        }
        return res.status(200).json({
            username,
        });
    }
};

handler.refreshToken = async (req, res) => {
    // Lấy access token từ header
    const authorizationHeader = req.headers['authorization'];
    const accessTokenFromHeader = authorizationHeader.split(' ')[1];
    if (!accessTokenFromHeader) {
        return res.status(401).json({ error: 'Không tìm thấy access token.' });
    }

    // Lấy refresh token từ body
    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
        return res.status(400).json({ error: 'Không tìm thấy refresh token.' });
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

    // Decode access token đó
    const decoded = await decodeToken(accessTokenFromHeader, accessTokenSecret);
    if (!decoded) {
        return res.status(401).json({ error: 'Access token không hợp lệ.' });
    }

    const username = decoded.payload.username; // Lấy username từ payload

    //
    const user = await userModel.findOne({ username });
    if (!user) {
        return res.status(401).json({ error: 'User không tồn tại.' });
    }

    const userRefreshToken = await refreshTokenModel.findOne({
        refresh_token_id: username,
    });

    if (refreshTokenFromBody !== userRefreshToken.refresh_token) {
        return res.status(400).json({ error: 'Refresh token không hợp lệ.' });
    }

    // Tạo access token mới
    const dataForAccessToken = {
        username,
        user_id: user.user_id,
    };

    const accessToken = await generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );
    if (!accessToken) {
        return res.status(400).json({
            error: 'Tạo access token không thành công, vui lòng thử lại.',
        });
    }
    return res.json({
        accessToken,
    });
};

export default handler;
