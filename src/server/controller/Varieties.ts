import { varietyApi } from "../../api/VarietyApi";
import { Variety } from "../../entity/Variety";
import express from "express";

import { addEndpoint } from "./addEndpoint";

import * as defaultEndpoints from "./defaultEndpoints";

const router = express.Router();

addEndpoint(router, varietyApi.one, defaultEndpoints.one(Variety));

addEndpoint(router, varietyApi.all, defaultEndpoints.all(Variety));

addEndpoint(router, varietyApi.create, defaultEndpoints.create(Variety));

export default router;
