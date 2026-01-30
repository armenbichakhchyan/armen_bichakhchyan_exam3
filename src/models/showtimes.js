import { pool } from "../config/db.js";

export const createShowtime = async (data) => {
    const {
        film_id,
        show_date,
        show_time,
        price,
        total_seats
    } = data;

    const query = `
    INSERT INTO showtimes
    (film_id, show_date, show_time, price, total_seats, available_seats)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    const [result] = await pool.query(query, [
        film_id,
        show_date,
        show_time,
        price,
        total_seats,
        total_seats
    ]);

    return result;
};


export const findByFilmAndTime = async (film_id, show_date, show_time) => {
    const [rows] = await pool.query(
        `SELECT id FROM showtimes
     WHERE film_id = ? AND show_date = ? AND show_time = ?`,
        [film_id, show_date, show_time]
    );
    return rows[0];
};
