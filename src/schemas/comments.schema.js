import Joi from "joi";

export const createCommentSchema = Joi.object({
    comment: Joi.string()
        .min(3)
        .max(500)
        .required()
        .messages({
            "string.min": "Comment must be at least 3 characters",
            "string.max": "Comment must be less than 500 characters"
        }),

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .optional()
});

export const commentIdParamSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
});
