import { bedApi } from "../../api/BedApi";
import { Bed } from "../../entity/Bed";
import express from "express";

import { addEndpoint } from "./addEndpoint";

import * as defaultEndpoints from "./defaultEndpoints";

const router = express.Router();

addEndpoint(router, bedApi.one, defaultEndpoints.one(Bed));

addEndpoint(router, bedApi.all, defaultEndpoints.all(Bed));

addEndpoint(router, bedApi.create, defaultEndpoints.create(Bed));

export default router;
