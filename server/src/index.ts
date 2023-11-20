import "reflect-metadata";
import express, { static as _static, json } from "express";
import { join } from "path";
import cors from "cors";
import { config } from "dotenv";
import { fileURLToPath } from "url";

const production = process.env.NODE_ENV === "production";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

config({
  path: join(__dirname, `../../.env${production ? ".production" : ""}.local`),
});
config({ path: join(__dirname, "../../.env") });

import { getDataSource } from "./dataSource.js";
import BedRoutes from "./controller/Beds.js";
import VarietyRoutes from "./controller/Varieties.js";
import GardenRoutes from "./controller/Gardens.js";
import PlantingRoutes from "./controller/Plantings.js";
import PlantRoutes from "./controller/Plants.js";
import PlanRoutes from "./controller/Plans.js";
import FamilyRoutes from "./controller/Families.js";

getDataSource()
  .initialize()
  .then(async (connection) => {
    // TODO: Remove for production.
    await connection.synchronize(false);

    connection.runMigrations();

    console.log(
      `Starting Express in ${production ? "production" : "development"} mode.`,
    );

    const app = express()
      .use(json(), cors())
      .use(BedRoutes)
      .use(GardenRoutes)
      .use(VarietyRoutes)
      .use(PlantingRoutes)
      .use(PlantRoutes)
      .use(PlanRoutes)
      .use(FamilyRoutes);

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE",
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
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
