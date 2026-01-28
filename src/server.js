import express from 'express';
import 'dotenv/config';
import './config/migrates.js';
import {connect} from "./config/db.js";
import errorHandler from "./middleware/errorhandler.js";
import filmsRouter from "./routing/films.js";
import usersRouter from "./routing/user.js";
import commentsRouter from "./routing/comments.js";
import showtimesRouter from './routing/showtimes.js'
import bookingsRouter from "./routing/bookings.js"

const app = express();
app.use(express.json());

const port = process.env.PORT;

app.use('/api/users', usersRouter);
app.use('/api/films', filmsRouter);
app.use('/api', commentsRouter)

app.use("/api/bookings", bookingsRouter);
app.use("/api/showtimes", showtimesRouter);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use(errorHandler)

app.listen(port, () => {
    (async () => {
        try {
            console.log(`Server started on port ${port}`);
            await connect();
        }catch (err) {
            console.log(err);
        }
    })()
})

