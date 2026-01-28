import {
    getAllFilms,
    getFilmById,
    createFilm,
    updateFilm,
    deleteFilm,
} from "../models/films.js";

export default {
    listFilms: async (req, res, next) => {
        try {
            const { page = 1, search = "" } = req.query;

            const result = await getAllFilms({
                page: Number(page),
                limit: 10,
                search
            });

            res.status(200).json({
                result
            })
        }catch (error) {
            next(error);
        }
    },

    getFilm: async (req, res, next) => {
        try {
            const film = await getFilmById(req.params.id);

            if (!film) {
                res.status(404).json({
                    message: "Film not found",
                })

                return
            }

            res.status(200).json({
                film
            })
        }catch (error) {
            next(error);
        }
    },

    addFilm: async (req, res, next) => {
        try {
            const result = await createFilm(req.params.id, req.body);

            if(result.affectedRows === 0){
                return res.status(404).json({ message: "Film not found" });
            }
        }catch (error) {
            next(error);
        }
    },

    editFilm: async (req, res, next) => {
        try {
            const result = await updateFilm(req.params.id, req.body);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Film not found" });
            }

            res.json({ message: "Film updated" });
        } catch (err) {
            next(err);
        }
    },

    deleteFilm: async (req, res, next) => {
        try {
            await deleteFilm(req.params.id);

            res.json({ message: "Film deleted" });
        }catch (error) {
            next(error);
        }
    }
}