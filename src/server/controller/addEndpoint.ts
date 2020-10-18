import { Endpoint } from "@/api/Endpoint";
import { RequestHandler, Router } from "express";

export function addEndpoint<
  Result,
  Data extends Record<string, unknown> | undefined,
  Params extends Record<string, string>
>(
  router: Router,
  endpoint: Endpoint<Result, Data, Params>,
  resolver: RequestHandler<Params, Result, Data>
): Router {
  return router[endpoint.method](endpoint.resource, resolver);
}
