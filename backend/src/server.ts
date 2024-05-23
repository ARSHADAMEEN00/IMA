import app from "./app";
import mongoose from "mongoose";
import { dbConnection } from "./config/dbConnection";
import { logEvents } from "./middleware/logger";
import env from "./util/validateEnv";

const port = env.PORT || 3500;

dbConnection()

mongoose.connection.once('open', () => {
  app.listen(port, () => {
    console.log("Server running " + port);
  });
})

mongoose.connection.on('error', error => {
  console.log("error", error)
  logEvents(`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`, "mongoErrLog.log")
})