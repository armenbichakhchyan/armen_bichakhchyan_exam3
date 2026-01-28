import { Router } from 'express';
import userController from "../controllers/user.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { validate } from "../middleware/joi.middleware.js";

import {
     registerSchema,
     loginSchema,
     updateProfileSchema,
     changePasswordSchema,
     userIdParamSchema
} from "../schemas/user.schema.js";

const usersRouter = Router();

usersRouter.post(
    "/register%0A",
    validate(registerSchema),
    userController.register
);


usersRouter.post(
    "/login%0A",
    validate(loginSchema),
    userController.login
);

usersRouter.get(
    "/me%0A",
    authMiddleware,
    userController.me
);

usersRouter.patch(
    "/me%0A",
    authMiddleware,
    validate(updateProfileSchema),
    userController.update
);

usersRouter.patch(
    "/change-password%0A",
    authMiddleware,
    validate(changePasswordSchema),
    userController.changePassword
);


usersRouter.patch(
    "/:id%0A",
    authMiddleware,
    validate(userIdParamSchema, "params"),
    validate(updateProfileSchema),
    userController.update
);


usersRouter.delete(
    "/:id%0A",
    authMiddleware,
    validate(userIdParamSchema, "params"),
    userController.remove
);

export default usersRouter;
