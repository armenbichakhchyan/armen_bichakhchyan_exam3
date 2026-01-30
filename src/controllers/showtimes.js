import moment from "moment";
import {
    createShowtime,
    findByFilmAndTime
} from "../models/showtimes.js";
import {getFilmById} from "../models/films.js";


export default {
    create: async (req, res, next) => {
        try {
            const {
                film_id,
                show_date,
                show_time,
                price,
                total_seats
            } = req.body;

            const film = await getFilmById(film_id);
            if (!film) {
                return res.status(404).json({ message: "Film not found" });
            }

            const start = moment(
                `${show_date} ${show_time}`,
                "YYYY-MM-DD HH:mm"
            );

            if (start.isBefore(moment())) {
                return res.status(400).json({
                    message: "Showtime cannot be in the past"
                });
            }

            const duplicate = await findByFilmAndTime(
                film_id,
                show_date,
                show_time
            );

            if (duplicate) {
                return res.status(409).json({
                    message: "Showtime already exists"
                });
            }

            await createShowtime({
                film_id,
                show_date,
                show_time,
                price,
                total_seats
            });

            res.status(201).json({
                message: "Showtime created successfully"
            });

        } catch (err) {
            next(err);
        }
    }
};
