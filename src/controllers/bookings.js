import { pool } from "../config/db.js";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import {createBooking, cancelBooking,  findShowtimeForUpdate, decreaseAvailableSeats, findMyBookings, countMyBookings} from "../models/bookings.js";


export default {

    create: async (req, res, next) => {
        const conn = await pool.getConnection();

        try {
            const userId = req.user.userId;
            const { showtime_id, seats } = req.body;

            const seatCount = seats.split(",").length;

            await conn.beginTransaction();

            const showtime = await findShowtimeForUpdate(conn, showtime_id);

            if (!showtime) {
                await conn.rollback();
                return res.status(404).json({ message: "Showtime not found" });
            }

            const showMoment = moment(
                `${showtime.show_date} ${showtime.show_time}`,
                "YYYY-MM-DD HH:mm"
            );

            if (showMoment.isBefore(moment())) {
                await conn.rollback();
                return res.status(400).json({
                    message: "Cannot book past showtime"
                });
            }

            if (showtime.available_seats < seatCount) {
                await conn.rollback();
                return res.status(400).json({
                    message: "Not enough available seats"
                });
            }

            const total_price = seatCount * showtime.price;
            const booking_reference = uuidv4();

            await createBooking(conn, {
                user_id: userId,
                showtime_id,
                seats,
                total_price,
                booking_reference
            });

            await decreaseAvailableSeats(conn, showtime_id, seatCount);

            await conn.commit();

            res.status(201).json({
                message: "Booking successful",
                booking_reference,
                total_price
            });

        } catch (err) {
            await conn.rollback();
            next(err);
        } finally {
            conn.release();
        }
    },

    cancel: async (req, res, next) => {
        const conn = await pool.getConnection();

        try {
            const userId = req.user.userId;
            const { id } = req.params;

            await conn.beginTransaction();

            const result = await cancelBooking(conn, id, userId);

            if (result.affectedRows === 0) {
                await conn.rollback();
                return res.status(404).json({
                    message: "Booking not found or already cancelled"
                });
            }

            await conn.commit();

            res.json({ message: "Booking cancelled" });

        } catch (err) {
            await conn.rollback();
            next(err);
        } finally {
            conn.release();
        }
    },

    myBookings: async (req, res, next) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const data = await findMyBookings(req.user.id, limit, offset);
            const total = await countMyBookings(req.user.id);

            res.json({
                page,
                totalPages: Math.ceil(total / limit),
                total,
                data
            });
        } catch (err) {
            next(err);
        }
    }
};
