import app from "./app";
import mongoose from "mongoose";
import env from "./util/validateEnv";
import { dbConnection } from "./config/dbConnection";
import { logEvents } from "./middleware/logger";

const port = 3100;

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