import { Router } from "express";
import controller from "../controllers/comments.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { validate } from "../middleware/joi.middleware.js";
import {
    createCommentSchema,
    commentIdParamSchema
} from "../schemas/comments.schema.js";

const commentsRouter = Router();

commentsRouter.get("/films/:id/comments", controller.listByFilm);

commentsRouter.post(
    "/films/:id/comments",
    authMiddleware,
    validate(createCommentSchema),
    controller.create
);

commentsRouter.delete(
    "/comments/:id",
    authMiddleware,
    validate(commentIdParamSchema, "params"),
    controller.delete
);

export default commentsRouter;
