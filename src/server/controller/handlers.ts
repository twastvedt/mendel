import type { Request } from "express";
import { EntityTarget, getManager, ObjectLiteral } from "typeorm";
import type { ParsedQs } from "qs";

type SimpleHandler<TParams, TResponse, TData> = (
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

export function update<T extends ObjectLiteral & { id: string | number }>(
  entity: EntityTarget<T>
): SimpleHandler<{ id: number }, void, Partial<T> & Pick<T, "id">> {
  return async (request) => {
    const repository = getManager().getRepository(entity);

    await repository.update(request.body.id, request.body);
  };
}
