/* eslint-disable @typescript-eslint/no-unused-vars */

import type { RequestHandler, Router, Request } from "express";
import type { ParsedQs } from "qs";
import { EntityTarget, getManager, ObjectLiteral, Repository } from "typeorm";

/**
 * Methods supported by both Axios and Express.
 */
type RestMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

/**
 * Express 4 doesn't catch errors in async handlers. This will. Can be removed once we upgrade to Express 5.
 */
export function addAsyncRoute<
  TResponse,
  TData = undefined,
  TParams extends Record<string, string | number | Date> | undefined = undefined
>(
  router: Router,
  method: RestMethod,
  path: string,
  handler: (
    req: Request<TParams, TResponse, TData, ParsedQs, Record<string, unknown>>
  ) => Promise<TResponse> | TResponse
): void {
  router[method](
    path,
    (
      req: Request<
        TParams,
        TResponse,
        TData,
        ParsedQs,
        Record<string, unknown>
      >,
      res,
      next
    ) => {
      Promise.resolve(handler(req))
        .then((result) => {
          res.send(result);
        })
        .catch(next);
    }
  );
}

export class Endpoint<
  TResponse,
  TData = undefined,
  TParams extends
    | { [P in keyof TParams]: string | number | Date }
    | undefined = undefined
> {
  public constructor(public method: RestMethod, public resource: string = "") {}

  public addHandler(
    router: Router,
    resolver: RequestHandler<TParams, TResponse, TData>
  ): void {
    router[this.method](this.resource, resolver);
  }

  public addWrappedHandler<TEntity extends ObjectLiteral>(
    router: Router,
    entity: EntityTarget<TEntity>,
    handler: (
      request: Request<
        TParams,
        TResponse,
        TData,
        ParsedQs,
        Record<string, unknown>
      >,
      repository: Repository<TEntity>
    ) => Promise<TResponse> | TResponse
  ): void;
  public addWrappedHandler(
    router: Router,
    handler: (
      request: Request<
        TParams,
        TResponse,
        TData,
        ParsedQs,
        Record<string, unknown>
      >
    ) => Promise<TResponse> | TResponse
  ): void;
  public addWrappedHandler(
    router: Router,
    ...rest:
      | [
          entity: EntityTarget<ObjectLiteral>,
          handler: (
            request: Request<
              TParams,
              TResponse,
              TData,
              ParsedQs,
              Record<string, unknown>
            >,
            repository: Repository<ObjectLiteral>
          ) => Promise<TResponse> | TResponse
        ]
      | [
          handler: (
            request: Request<
              TParams,
              TResponse,
              TData,
              ParsedQs,
              Record<string, unknown>
            >
          ) => Promise<TResponse> | TResponse
        ]
  ): void {
    if (rest.length === 2) {
      addAsyncRoute<TResponse, TData, TParams>(
        router,
        this.method,
        this.resource,
        (request) => {
          const repository = getManager().getRepository(rest[0]);

          return rest[1](request, repository);
        }
      );
    } else {
      addAsyncRoute<TResponse, TData, TParams>(
        router,
        this.method,
        this.resource,
        rest[0]
      );
    }
  }
}
