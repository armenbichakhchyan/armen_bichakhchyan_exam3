import { Router } from "express";
import controller from "../controllers/films.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import { validate } from "../middleware/joi.middleware.js";
import {
    createFilmSchema,
    updateFilmSchema
} from "../schemas/films.schema.js";

const filmsRouter = Router();


filmsRouter.get("/", controller.listFilms);
filmsRouter.get("/:id", controller.getFilm);


filmsRouter.post(
    "/",
    authMiddleware,
    adminMiddleware,
    validate(createFilmSchema),
    controller.addFilm
);

filmsRouter.patch(
    "/:id",
    authMiddleware,
    adminMiddleware,
    validate(updateFilmSchema),
    controller.editFilm
);

filmsRouter.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    controller.deleteFilm
);

export default filmsRouter;
