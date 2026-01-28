import Joi from "joi";


export const createFilmSchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            "string.base": "Title must be a string",
            "string.min": "Title must be at least 2 characters",
            "any.required": "Title is required"
        }),

    genre: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            "any.required": "Genre is required"
        }),

    duration: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base": "Duration must be a number (minutes)",
            "number.min": "Duration must be at least 1 minute"
        }),

    description: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .messages({
            "any.required": "Description is required"
        })
});

export const updateFilmSchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(255)
        .optional(),

    genre: Joi.string()
        .min(2)
        .max(100)
        .optional(),

    duration: Joi.number()
        .integer()
        .min(1)
        .optional(),

    description: Joi.string()
        .min(10)
        .max(2000)
        .optional()
}).min(1);
