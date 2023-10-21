import jwt from 'jsonwebtoken';

export function generateToken(payload, secretSignature, tokenLife) {
    try {
        return jwt.sign(
            {
                payload,
            },
            secretSignature,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife,
            },
        );
    } catch (error) {
        console.log(`Error in generate access token:  + ${error}`);
        return null;
    }
}

export async function verifyToken(token, secretKey) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.log(`Error in verify access token:  + ${error}`);
        return null;
    }
}

export async function decodeToken(token, secretKey) {
    try {
        return jwt.verify(token, secretKey, {
            ignoreExpiration: true,
        });
    } catch (error) {
        console.log(`Error in decode access token: ${error}`);
        return null;
    }
}
