import Joi from "joi";

export const createShowtimeSchema = Joi.object({
    film_id: Joi.number()
        .integer()
        .positive()
        .required(),

    show_date: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "Invalid date format"
        }),

    show_time: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            "string.pattern.base": "Time must be in HH:mm format"
        }),

    price: Joi.number()
        .positive()
        .required(),

    total_seats: Joi.number()
        .integer()
        .min(1)
        .default(50)
});
