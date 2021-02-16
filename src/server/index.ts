import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";

import BedRoutes from "./controller/Beds";
import VarietyRoutes from "./controller/Varieties";
import GardenRoutes from "./controller/Gardens";

createConnection()
  .then(async (connection) => {
    // TODO: Remove for production.
    await connection.synchronize(true);

    connection.runMigrations();

    const app = express();

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      next();
    });

    app.use(bodyParser.json());

    app.use(BedRoutes);
    app.use(GardenRoutes);
    app.use(VarietyRoutes);

    // Run app
    app.listen(3000);

    console.log("Express application is up and running on port 3000");
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
