import "reflect-metadata";
import { createConnection } from "typeorm";
import express, { static as _static, json } from "express";
import { join } from "path";

import BedRoutes from "./controller/Beds";
import VarietyRoutes from "./controller/Varieties";
import GardenRoutes from "./controller/Gardens";
import PlantRoutes from "./controller/Plants";
import PlantingRoutes from "./controller/Plantings";
import FamilyRoutes from "./controller/Families";

createConnection()
  .then(async (connection) => {
    // TODO: Remove for production.
    await connection.synchronize(true);

    connection.runMigrations();

    const production = process.env.NODE_ENV === "production";

    console.log(
      `Starting Express in ${production ? "production" : "development"} mode.`
    );

    const app = express()
      .use(json())
      .use(BedRoutes)
      .use(GardenRoutes)
      .use(VarietyRoutes)
      .use(PlantRoutes)
      .use(PlantingRoutes)
      .use(FamilyRoutes);

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

    const publicPath = join(__dirname, "../clientBuild");

    if (production) {
      app.use(_static(publicPath, { maxAge: "1y", etag: false }));
    }

    // Run app
    app.listen(3000);

    console.log("Express application is up and running on port 3000");
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
