import { Router } from "express";
import controller from "../controllers/bookings.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { validate } from "../middleware/joi.middleware.js";
import {
    createBookingSchema,
    bookingIdParamSchema
} from "../schemas/bookings.schema.js";

const bookingsRouter = Router();

bookingsRouter.get("/my", authMiddleware, controller.myBookings);

bookingsRouter.post(
    "/",
    authMiddleware,
    validate(createBookingSchema),
    controller.create
);

bookingsRouter.patch(
    "/:id/cancel",
    authMiddleware,
    validate(bookingIdParamSchema, "params"),
    controller.cancel
);


export default bookingsRouter;