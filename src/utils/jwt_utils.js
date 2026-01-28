import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET) {
    throw new Error(
        "Secret for sign token is required. Please try again."
    )
}

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export const signToken = async (payload, expiresIn = "1h") => {
    return await signAsync(payload, JWT_SECRET, { expiresIn });
}

export const verifyToken = async (token) => {
    try {
        return await verifyAsync(token, JWT_SECRET);
    }catch(err) {
        throw new Error("Invalid or expired token");
    }
}