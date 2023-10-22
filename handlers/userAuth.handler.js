import bcrypt from 'bcrypt';
// import randToken from 'rand-token';
import userModel from '../models/user.model.js';
import refreshTokenModel from '../models/userRefreshToken.model.js';
import { generateToken, decodeToken } from '../utils/auth.js';
import RESPONSE from '../constants/response.js';

const handler = {};
const saltRounds = 10;

handler.login = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    // Kiểm tra tài khoản và mật khẩu
    const user = await userModel.findOne({ username });
    if (!user) {
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'Tài khoản không tồn tại.'));
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res
            .status(401)
            .json(RESPONSE.FAILURE(401, 'Mật khẩu không chính xác.'));
    }

    // Tạo access token
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;

    const accessTokenData = {
        username: user.username,
    };
    const accessToken = generateToken(
        accessTokenData,
        accessTokenSecret,
        accessTokenLife,
    );
    if (!accessToken) {
        return res
            .status(500)
            .send(
                RESPONSE.FAILURE(
                    500,
                    'Đăng nhập không thành công, vui lòng thử lại.',
                ),
            );
    }

    // Refresh token
    let refreshToken = null;
    // map username với refresh token
    const userRefreshToken = await refreshTokenModel.findById(user.username);

    if (!userRefreshToken?.refresh_token) {
        refreshToken = generateToken(
            accessTokenData,
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

    return res.status(200).json(
        RESPONSE.SUCCESS(
            {
                accessToken,
                refreshToken,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                },
            },
            'Đăng nhập thành công.',
            null,
        ),
    );
};

handler.register = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const user = await userModel.findOne({ username });
    if (user)
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'Tên tài khoản đã tồn tại.'));
    else {
        const hashPassword = bcrypt.hashSync(req.body.password, saltRounds);

        const newUser = await userModel.add({
            username: username,
            password: hashPassword,
        });
        if (!newUser) {
            return res
                .status(500)
                .json(
                    RESPONSE.FAILURE(
                        500,
                        'Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.',
                    ),
                );
        }
        return res
            .status(201)
            .json(RESPONSE.SUCCESS({ username }, 'created', null));
    }
};

handler.refreshToken = async (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    const accessTokenFromHeader = authorizationHeader?.split(' ')[1];
    if (!accessTokenFromHeader) {
        return res.status(401).json(RESPONSE.FAILURE(401, 'Access denied'));
    }

    // Lấy refresh token từ body
    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'Không tìm thấy refresh token.'));
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

    // Decode access token đó
    const decoded = await decodeToken(accessTokenFromHeader, accessTokenSecret);
    if (!decoded)
        return res.status(401).json(RESPONSE.FAILURE(401, 'Access denied'));

    console.log('decoded', decoded);
    const username = decoded.payload.username; // Lấy username từ payload

    const user = await userModel.findOne({ username });
    if (!user) {
        return res.status(401).json(RESPONSE.FAILURE(401, 'user not found'));
    }

    const userRefreshToken = await refreshTokenModel.findOne({
        refresh_token_id: username,
    });

    if (refreshTokenFromBody !== userRefreshToken.refresh_token) {
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'Refresh token không hợp lệ.'));
    }

    // Tạo access token mới
    const accessTokenData = {
        username,
        user_id: user.user_id,
    };

    const accessToken = generateToken(
        accessTokenData,
        accessTokenSecret,
        accessTokenLife,
    );
    if (!accessToken)
        return res
            .status(500)
            .json(
                RESPONSE.FAILURE(
                    500,
                    'Tạo access token không thành công, vui lòng thử lại.',
                ),
            );

    return res
        .status(200)
        .json(
            RESPONSE.SUCCESS(
                accessToken,
                'Tạo thành công access token mới',
                null,
            ),
        );
};

export default handler;
