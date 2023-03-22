import { Endpoint } from "@mendel/common";
import {
  RequestHandler,
  Router,
  Request,
  Response,
  NextFunction,
} from "express";
import { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { dataSource } from "../dataSource";

type ExpressMethod =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"
  | "checkout"
  | "connect"
  | "copy"
  | "lock"
  | "merge"
  | "mkactivity"
  | "mkcol"
  | "move"
  | "m-search"
  | "notify"
  | "propfind"
  | "proppatch"
  | "purge"
  | "report"
  | "search"
  | "subscribe"
  | "trace"
  | "unlock"
  | "unsubscribe";

/**
 * Express 4 doesn't catch errors in async handlers. This will. Can be removed once we upgrade to Express 5 (currently in alpha).
 */
export function addAsyncRoute<
  TParams extends ParamsDictionary,
  TResponse,
  TData
>(
  router: Router,
  method: ExpressMethod,
  path: string,
  handler: (
    req: Request<TParams, TResponse, TData, ParsedQs, Record<string, unknown>>,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>
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
      Promise.resolve(handler(req, res, next)).catch(next);
    }
  );
}

/**
 * Express 4 doesn't catch errors in async handlers. This will. Can be removed once we upgrade to Express 5 (currently in alpha).
 */
export function addWrappedAsyncRoute<
  TParams extends ParamsDictionary,
  TResponse,
  TData
>(
  router: Router,
  method: ExpressMethod,
  path: string,
  handler: (
    req: Request<TParams, TResponse, TData, ParsedQs, Record<string, unknown>>
  ) => Promise<unknown> | unknown
): void {
  addAsyncRoute<TParams, TResponse, TData>(
    router,
    method,
    path,
    (req, res, next) => {
      Promise.resolve(handler(req))
        .then((result) => {
          if (typeof result === "object") {
            res.json(result);
          } else {
            res.send(result);
          }
        })
        .catch(next);
    }
  );
}

/**
 * Add an Express route for an endpoint. Does no additional processing.
 * @param endpoint The endpoint object
 * @param router An express router. Create using, e.g. `const router = new Router()`.
 * @param resolver Callback method to handle the request.
 */
export function addHandler<
  TParams extends { [P in keyof TParams]: string | number | Date } | undefined,
  TData,
  TResponse
>(
  endpoint: Endpoint<TParams, TData, TResponse>,
  router: Router,
  resolver: RequestHandler
): void {
  router[endpoint.method](endpoint.resource, resolver);
}

export function addWrappedHandler<
  TParams extends { [P in keyof TParams]: string | number | Date } | undefined,
  TData,
  TResponse,
  TEntity extends ObjectLiteral
>(
  endpoint: Endpoint<TParams, TData, TResponse>,
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
export function addWrappedHandler<
  TParams extends { [P in keyof TParams]: string | number | Date } | undefined,
  TData,
  TResponse
>(
  endpoint: Endpoint<TParams, TData, TResponse>,
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
export function addWrappedHandler<
  TParams extends { [P in keyof TParams]: string | number | Date } | undefined,
  TData,
  TResponse
>(
  endpoint: Endpoint<TParams, TData, TResponse>,
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
    addWrappedAsyncRoute(
      router,
      endpoint.method,
      endpoint.resource,
      (
        request: Request<
          ParamsDictionary,
          TResponse,
          TData,
          ParsedQs,
          Record<string, unknown>
        >
      ) => {
        const repository = dataSource.manager.getRepository(rest[0]);

        return (
          rest[1] as (
            req: Request<
              ParamsDictionary,
              TResponse,
              TData,
              ParsedQs,
              Record<string, unknown>
            >,
            repository: Repository<ObjectLiteral>
          ) => Promise<unknown> | unknown
        )(request, repository);
      }
    );
  } else {
    addWrappedAsyncRoute(
      router,
      endpoint.method,
      endpoint.resource,
      rest[0] as (
        req: Request<
          ParamsDictionary,
          TResponse,
          TData,
          ParsedQs,
          Record<string, unknown>
        >
      ) => Promise<unknown> | unknown
    );
  }
}
