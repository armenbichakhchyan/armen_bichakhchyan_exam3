import { pool } from "../config/db.js";
import _ from "lodash";

export const findUserByPk = async (id) => {
    const [rows] = await pool.query(
        `SELECT id, username, email, full_name, role, created_at
         FROM users WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
};

export const findOneByEmail = async (email) => {
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email]
    );
    return rows[0] || null;
};

export const createUser = async (data) => {
    const { username, email, passwordHash, full_name, role = "user" } = data;

    const [result] = await pool.query(
        `INSERT INTO users (username, email, passwordHash, full_name, role)
     VALUES (?, ?, ?, ?, ?)`,
        [username, email, passwordHash, full_name, role]
    );

    return result.insertId;
};

export const updateUser = async (id, payload) => {
    const allowedFields = ["username", "email", "full_name", "role", "passwordHash"];
    const data = _.pick(payload, allowedFields);

    if (_.isEmpty(data)) return null;

    const fields = Object.keys(data).map(k => `${k} = ?`).join(", ");
    const values = Object.values(data);

    const [result] = await pool.query(
        `UPDATE users SET ${fields} WHERE id = ?`,
        [...values, id]
    );

    return result;
};


export const updatePassword = async (passwordHash, userId) => {
    const query = `
    UPDATE users
    SET passwordHash = ?
    WHERE id = ?
  `;

    const [result] = await pool.query(query, [passwordHash, userId]);

    return result;
};

export const deleteUserById = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM users WHERE id = ?`,
        [id]
    );
    return result;
};
