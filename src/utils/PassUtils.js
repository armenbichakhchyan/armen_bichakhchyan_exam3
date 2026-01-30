import bcrypt from 'bcrypt';
import util from 'util';

const hash = util.promisify(bcrypt.hash);
const compare = util.promisify(bcrypt.compare);

const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
const passwordkey = process.env.PASSWORD_KEY

if(!passwordkey) {
    throw new Error(
        "Secret for sign token is required. Please try again."
    )
}

if (!saltRounds) {
    throw new Error("salt round is required.");
}

export const hashPassword = async (password) => {
    return await hash(password + passwordkey, passwordkey);
}

export const comparePassword = async (password, hashedPassword) => {
    return await compare(password + passwordkey, hashedPassword);
}
