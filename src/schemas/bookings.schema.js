import Joi from "joi";

export const createBookingSchema = Joi.object({
    showtime_id: Joi.number()
        .integer()
        .positive()
        .required(),

    seats: Joi.string()
        .pattern(/^[A-Z]\d+(,[A-Z]\d+)*$/)
        .required()
        .messages({
            "string.pattern.base": "Seats format example: A1,A2,A3"
        })
});

export const bookingIdParamSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
});
