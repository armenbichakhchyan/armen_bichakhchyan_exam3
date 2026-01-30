import {
    createComment,
    getCommentsByFilm,
    findCommentById,
    deleteCommentById
} from "../models/comments.js";
import moment from "moment";

export default {
    listByFilm: async (req, res, next) => {
        try {
            const film_id = req.params.film_id;

            const comments = await getCommentsByFilm(film_id);

            res.json({ comments });
        }catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const film_id = req.params.film_id;
            const user_id = req.userId;

            const { comment, rating } = req.body;

            await createComment({
                user_id,
                film_id,
                comment,
                rating
            });

            res.status(201).json({
                message: "Comment added successfully",
                comment
            })
        }catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const user = req.user;

            const comment = await findCommentById(commentId);

            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found"
                });
            }

            if (
                comment.user_id !== user.userId &&
                user.role !== "admin"
            ) {
                return res.status(403).json({
                    message: "You cannot delete this comment"
                });
            }

            const createdAt = moment(comment.createdAt);
            const now = moment();

            const diffHours = now.diff(createdAt, "hours");

            if (diffHours > 24 && user.role !== "admin") {
                return res.status(403).json({
                    message: "You can delete comment only within 24 hours"
                });
            }

            await deleteCommentById(commentId);

            res.json({
                message: "Comment deleted successfully"
            });
        } catch (err) {
            next(err);
        }
    }
}