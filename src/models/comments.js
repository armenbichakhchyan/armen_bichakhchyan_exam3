import { pool } from '../config/db.js';

export const createComment = async ({ user_id, film_id, comment, rating }) => {
    const query = `
        INSERT INTO comments (user_id, film_id, comment, rating) VALUES (?, ?, ?, ?);
    `;

    const [result] = await pool.query(query, [
        user_id,
        film_id,
        comment,
        rating,
    ]);

    return result;
};

export const getCommentsByFilm = async (film_id) => {
    const query = `
        SELECT c.id, c.comment, c.rating, c.created_at,
        u.username, u.full_name
        FROM comments c 
        JOIN users u ON u.id = c.user_id
        WHERE c.film_id = ?;
        ORDER BY c.created_at DESC
    `;

    const [rows] = await pool.query(query, [film_id]);
    return rows;
};

export const findCommentById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM comments WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
};

export const deleteCommentById = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM comments WHERE id = ?`,
        [id]
    );
    return result;
};