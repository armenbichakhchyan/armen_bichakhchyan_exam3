import { Router } from "express";
import controller from "../controllers/showtimes.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import { validate } from "../middleware/joi.middleware.js";
import { createShowtimeSchema } from "../schemas/showtimes․schema.js";

const showtimesRouter = Router();

showtimesRouter.post(
    "/showtimes",
    authMiddleware,
    adminMiddleware,
    validate(createShowtimeSchema),
    controller.create
);

export default showtimesRouter;
