import { Endpoint } from "@/api/Endpoint";
import { RequestHandler, Router, Request } from "express";
import { EntityTarget, getManager, ObjectLiteral, Repository } from "typeorm";
import type { ParsedQs } from "qs";

export function addEndpoint<
  Result,
  Data extends Record<string, unknown> | undefined,
  Params extends Record<string, string | number | Date> | undefined
>(
  router: Router,
  endpoint: Endpoint<Result, Data, Params>,
  resolver: RequestHandler<Params, Result, Data>
): Router {
  return router[endpoint.method](endpoint.resource, resolver);
}

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

export function wrapHandler<
  T extends ObjectLiteral,
  Params extends Record<string, string | number | Date>,
  Data extends Record<string, unknown>,
  Response
>(
  entity: EntityTarget<T>,
  endpoint: Endpoint<Response, Data, Params>,
  handler: (
    request: Request<Params, Response, Data, ParsedQs, Record<string, unknown>>,
    repository: Repository<T>
  ) => Promise<Response> | Response
): RequestHandler<Params, Response, Data> {
  return async (request, response) => {
    const repository = getManager().getRepository(entity);

    try {
      response.send(await handler(request, repository));
    } catch (error) {
      response.status(404);
      response.end();
      return;
    }
  };
}
