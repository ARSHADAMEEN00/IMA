import "dotenv/config"; //to access env 
import express from "express";

import authRoutes from "./routes/auth";
import emiRoutes from "./routes/kuri";
import * as staticRoutes from "./routes/root";

import morgan from "morgan";
import createHttpError from "http-errors";
import cors from 'cors';
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";

import { authenticateUser } from "./middleware/verifyAuth";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import { corsOptions } from "./config/corsOption";
import { setupCronJob } from "./util/cronJobs";

const app = express();

// setupCronJob();

app.use(session({
  secret: env.JWT_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: env.MONGO_CONNECTION_STRING,
  })
}))

app.use(logger)
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/kuri", authenticateUser, emiRoutes);

app.use("/profile/demo", (req, res) => {
  res.send({
    msg: 'demo'
  });
  console.log('demo');
});


// app.use("/api/admin/kudumbashree", authenticateUser, isAdminProtected, kudumbashreeRoutes);
// app.use("/api/admin/user", authenticateUser, isAdminProtected, userRoutes);


app.use('/static', staticRoutes.default)
app.all("*", staticRoutes.notFound)


app.use((req, res, next) => {
  next(
    createHttpError(404, "Endpoint Not Found, you accessing an unknown url")
  );
});

app.use(errorHandler)

export default app;