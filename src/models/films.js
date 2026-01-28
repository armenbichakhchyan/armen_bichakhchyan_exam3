import { pool } from '../config/db.js';

export const getAllFilms = async ({ page = 1, limit = 10, search = "",  }) => {
    const offset = (page - 1) * limit;

    const searchQuery = `%${search}%`;

    const [rows] = await pool.query(
        `   
        SELECT * FROM films WHERE title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?
        `,
        [searchQuery, limit, offset],
    );

    const [[{ total }]] = await pool.query(
        `
        SELECT COUNT(*) as total FROM films WHERE title LIKE ?
        `,
        [searchQuery]
    );

    return {
        films: rows,
        total,
        page,
        totalPages: Math.ceil(rows / limit),
    }
}

export const getFilmById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM films WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
};

export const createFilm = async (data) => {
    const { title, description, genre, duration } = data;

    const [result] = await pool.query(
        `
            INSERT INTO films (title, descriptio, genre, duration) VALUES (?, ?, ?, ?)
        `, [title, description, genre, duration]);

        return result.insertId

}

export const updateFilm = async (id, data) => {
    const { title, description, genre, duration } = data;

    const [result] = await pool.query(
        `
            UPDATE films
            SET title = ?, description = ?, genre = ?, duration = ?
            WHERE id = ?
        `,
        [title, description, genre, duration, id]
    )

    return result
}

export const deleteFilm = async (id) => {
    const [[ count ]] = await pool.query(
        `
            SELECT COUNT(*) as COUNT FROM films b JOIN showtimes s ON b.showtime_id = s.id
            WHERE s.film_id = ?
        `, [id]
    );

    if (count) {
        throw new Error("Film has bookings and cannot be deleted.")
    }

    const [result] = await pool.quert(
        `DELETE FROM films WHERE id = ?` [id],
    );

    return result
}