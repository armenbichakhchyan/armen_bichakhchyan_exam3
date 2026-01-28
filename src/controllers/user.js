import {
    findUserByPk,
    findOneByEmail,
    createUser,
    updateUser,
    updatePassword,
    deleteUserById
} from "../models/user.js";

import { hashPassword, comparePassword } from "../utils/PassUtils.js";
import { signToken } from "../utils/jwt_utils.js";

export default {

    async register(req, res, next) {
        try {
            const { username, email, password, full_name } = req.body;

            const exist = await findOneByEmail(email);
            if (exist) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const passwordHash = await hashPassword(password);

            await createUser({
                username,
                email,
                passwordHash,
                full_name
            });

            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            next(err);
        }
    },


    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await findOneByEmail(email);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isMatch = await comparePassword(password, user.passwordHash);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = await signToken({
                userId: user.id,
                role: user.role
            });

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                }
            });
        } catch (err) {
            next(err);
        }
    },


    async me(req, res, next) {
        try {
            const user = await findUserByPk(req.user.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ user });
        } catch (err) {
            next(err);
        }
    },


    async update(req, res, next) {
        try {
            const { id } = req.params;
            const payload = { ...req.body };

            if (payload.password) {
                payload.passwordHash = await hashPassword(payload.password);
                delete payload.password;
            }

            const result = await updateUser(id, payload);
            if (!result || result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found or no changes" });
            }

            const user = await findUserByPk(id);
            res.json({ message: "User updated", user });
        } catch (err) {
            next(err);
        }
    },

    async remove(req, res, next) {
        try {
            const result = await deleteUserById(req.params.id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ message: "User deleted successfully" });
        } catch (err) {
            next(err);
        }
    },

    async changePassword(req, res, next) {
        try {
            const userId = req.user.userId;
            const { oldPassword, newPassword } = req.body;

            const user = await findUserByPk(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const isMatch = await comparePassword(oldPassword, user.passwordHash);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Old password is incorrect"
                });
            }

            const newPasswordHash = await hashPassword(newPassword);

            await updatePassword(newPasswordHash, userId);

            return res.status(200).json({
                message: "Password changed successfully"
            });

        } catch (err) {
            next(err);
        }
    }
};
