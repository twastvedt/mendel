import { Beds } from "../../api/Api";
import { Bed } from "../../entity/Bed";
import express from "express";
import { getManager } from "typeorm";

import { addEndpoint } from "./addEndpoint";

const router = express.Router();

addEndpoint(router, Beds.one, async (request, response) => {
  const repository = getManager().getRepository(Bed);

  const entity = await repository.findOne(request.params.id);

  if (!entity) {
    response.status(404);
    response.end();
    return;
  }

  response.send(entity);
});

addEndpoint(router, Beds.all, async (request, response) => {
  const repository = getManager().getRepository(Bed);

  const entities = await repository.find();

  response.send(entities);
});

addEndpoint(router, Beds.create, async (request, response) => {
  const repository = getManager().getRepository(Bed);

  const newEntity = repository.create(request.body);

  await repository.save(newEntity);

  response.send(newEntity);
});

export default router;
