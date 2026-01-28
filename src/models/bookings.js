import { pool } from "../config/db.js";

export const createBooking = async (conn, data) => {
    const {
        user_id,
        showtime_id,
        seats,
        total_price,
        booking_reference
    } = data;

    const query = `
    INSERT INTO bookings
    (user_id, showtime_id, seats, total_price, booking_reference)
    VALUES (?, ?, ?, ?, ?)
  `;

    const [result] = await conn.query(query, [
        user_id,
        showtime_id,
        seats,
        total_price,
        booking_reference
    ]);

    return result;
};

export const cancelBooking = async (conn, bookingId, userId) => {
    const query = `
    UPDATE bookings
    SET status = 'cancelled'
    WHERE id = ? AND user_id = ? AND status = 'confirmed'
  `;

    const [result] = await conn.query(query, [bookingId, userId]);
    return result;
};

export const findUserBookings = async (userId, limit, offset) => {
    const query = `
        SELECT b.*, f.title, s.show_date, s.show_time
        FROM bookings b
                 JOIN showtimes s ON b.showtime_id = s.id
                 JOIN films f ON s.film_id = f.id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
            LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [userId, limit, offset]);
    return rows;
};


export const findShowtimeForUpdate = async (conn, id) => {
    const [rows] = await conn.query(
        `SELECT * FROM showtimes WHERE id = ? FOR UPDATE`,
        [id]
    );
    return rows[0];
};

export const decreaseAvailableSeats = async (conn, id, count) => {
    return conn.query(
        `UPDATE showtimes
     SET available_seats = available_seats - ?
     WHERE id = ?`,
        [count, id]
    );
};

export const findMyBookings = async (userId, limit, offset) => {
    const [rows] = await pool.query(
        `
    SELECT 
      b.id,
      b.booking_reference,
      b.seats,
      b.total_price,
      b.status,
      b.booking_date,

      f.title AS film_title,
      s.show_date,
      s.show_time

    FROM bookings b
    JOIN showtimes s ON s.id = b.showtime_id
    JOIN films f ON f.id = s.film_id

    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC
    LIMIT ? OFFSET ?
    `,
        [userId, limit, offset]
    );

    return rows;
};

export const countMyBookings = async (userId) => {
    const [[row]] = await pool.query(
        `SELECT COUNT(*) AS total FROM bookings WHERE user_id = ?`,
        [userId]
    );

    return row.total;
};
