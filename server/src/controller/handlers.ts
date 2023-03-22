import type { Request } from "express";
import {
  DeepPartial,
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
} from "typeorm";
import type { ParsedQs } from "qs";
import { EntityBase } from "@mendel/common";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../dataSource";

type SimpleHandler<TParams, TData, TResponse> = (
  request: Request<TParams, TResponse, TData, ParsedQs, Record<string, unknown>>
) => Promise<TResponse> | TResponse;

// type ApiHandlers<TApi> = { [K in keyof TApi]: TApi[K] extends Endpoint<infer TResponse, infer TData, infer TParams> ? (
//       request: Request<
//         TParams,
//         TResponse,
//         TData,
//         ParsedQs,
//         Record<string, unknown>
//       >
//     ) => Promise<TResponse> | TResponse :
//   never
// }

// export function handleApi<TEndpoints extends string, TApi extends  Record<TEndpoints, Endpoint<unknown, unknown, {} | undefined>>>(router: Router, api: TApi, handlers: ApiHandlers<TApi>): void {
//   for (const endpoint in api) {
//     api[endpoint].addWrappedHandler(router, handlers[endpoint])
//   }
// }

export function one<T extends ObjectLiteral & EntityBase>(
  entity: EntityTarget<T>
): SimpleHandler<{ id: number }, undefined, T> {
  return async (request) => {
    const repository = dataSource.manager.getRepository(entity);

    // TODO: awaiting fix in https://github.com/typeorm/typeorm/pull/9709.
    const query = { id: request.params.id } as FindOptionsWhere<T>;

    const result = await repository.findOneBy(query);

    if (!result) {
      throw new Error(`Could not find element for id ${request.params.id}.`);
    }

    return result;
  };
}

export function remove<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): SimpleHandler<{ id: number }, undefined, void> {
  return async (request) => {
    const repository = dataSource.manager.getRepository(entity);

    const result = await repository.delete(request.params.id);

    if (!result) {
      throw new Error(`Could not find element for id ${request.params.id}.`);
    }
  };
}

export function all<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): SimpleHandler<undefined, undefined, T[]> {
  return async () => {
    const repository = dataSource.manager.getRepository(entity);

    const entities = await repository.find();

    return entities;
  };
}

export function create<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): SimpleHandler<undefined, T | T[], T | T[]> {
  return async (request) => {
    const repository = dataSource.manager.getRepository(entity);

    if (Array.isArray(request.body)) {
      return repository.save(request.body as DeepPartial<T>[]);
    } else {
      return repository.save(request.body as DeepPartial<T>);
    }
  };
}

export function update<T extends EntityBase>(
  entity: EntityTarget<T>
): SimpleHandler<undefined, Partial<T> & { id: number }, void> {
  return async (request) => {
    const repository = dataSource.manager.getRepository(entity);

    await repository.update(
      request.body.id,
      request.body as QueryDeepPartialEntity<T>
    );
  };
}
