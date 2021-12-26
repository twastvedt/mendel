import type { Request } from "express";
import { EntityTarget, getManager, ObjectLiteral } from "typeorm";
import type { ParsedQs } from "qs";

type SimpleHandler<TParams, TResponse, TData> = (
  request: Request<TParams, TResponse, TData, ParsedQs, Record<string, unknown>>
) => Promise<TResponse> | TResponse;

export function one<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): SimpleHandler<{ id: number }, T, undefined> {
  return async (request) => {
    const repository = getManager().getRepository(entity);

    const result = await repository.findOne(request.params.id);

    if (!result) {
      throw new Error(`Could not find element for id ${request.params.id}.`);
    }

    return result;
  };
}

export function remove<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): SimpleHandler<{ id: number }, void, undefined> {
  return async (request) => {
    const repository = getManager().getRepository(entity);

    const result = await repository.delete(request.params.id);

    if (!result) {
      throw new Error(`Could not find element for id ${request.params.id}.`);
    }
  };
}

export function all<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): SimpleHandler<undefined, T[], undefined> {
  return async () => {
    const repository = getManager().getRepository(entity);

    const entities = await repository.find();

    return entities;
  };
}

export function create<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): SimpleHandler<undefined, T, Partial<T>> {
  return async (request) => {
    const repository = getManager().getRepository(entity);

    const newEntity = repository.create(request.body);

    await repository.save(newEntity);

    return newEntity;
  };
}
