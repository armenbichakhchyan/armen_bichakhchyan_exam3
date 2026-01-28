import bcrypt from 'bcrypt';

const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;

if(!saltRounds) {
    throw new Error(
        "salt round is required. Please try again."
    )
}

export const  hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}