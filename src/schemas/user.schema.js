import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/)
        .required()
        .messages({
            "string.base": "Username must be a string",
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username must be at most 30 characters",
            "string.pattern.base": "Username must contain letters and can include numbers or _",
            "any.required": "Username is required"
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Invalid email format",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required"
        }),

    full_name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.min": "Full name must be at least 3 characters",
            "any.required": "Full name is required"
        })
});


export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),

    password: Joi.string()
        .required()
});

export const updateProfileSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/)
        .optional(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional(),

    full_name: Joi.string()
        .min(3)
        .max(100)
        .optional()
})
    .min(1)
    .messages({
        "object.min": "At least one field is required to update"
    });


export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .required(),

    newPassword: Joi.string()
        .min(6)
        .max(50)
        .required(),

    confirmPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Passwords do not match"
        })
});


export const adminCreateUserSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/)
        .required(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),

    password: Joi.string()
        .min(6)
        .max(50)
        .required(),

    full_name: Joi.string()
        .min(3)
        .max(100)
        .required(),

    role: Joi.string()
        .valid("user", "admin")
        .default("user")
});

export const userIdParamSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
});
