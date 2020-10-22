import { RequestHandler } from "express";
import { EntityTarget, getManager, ObjectLiteral } from "typeorm";

export function one<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): RequestHandler<{ id: string }, T, undefined> {
  return async (request, response) => {
    const repository = getManager().getRepository(entity);

    const result = await repository.findOne(request.params.id);

    if (!result) {
      response.status(404);
      response.end();
      return;
    }

    response.send(result);
  };
}

export function all<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): RequestHandler<undefined, T[], undefined> {
  return async (request, response) => {
    const repository = getManager().getRepository(entity);

    const entities = await repository.find();

    response.send(entities);
  };
}

export function create<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): RequestHandler<undefined, T, Partial<T>> {
  return async (request, response) => {
    const repository = getManager().getRepository(entity);

    const newEntity = repository.create(request.body);

    await repository.save(newEntity);

    response.send(newEntity);
  };
}
