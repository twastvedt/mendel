import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";

import { Bed } from "../entity/Bed";

import Beds from "./controller/Beds";

createConnection()
  .then(async (connection) => {
    const app = express();

    app.use(bodyParser.json());

    app.use(`/${Bed}`, Beds);

    // Run app
    app.listen(3000);

    console.log("Express application is up and running on port 3000");
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
