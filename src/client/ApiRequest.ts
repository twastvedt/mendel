import axios from "axios";
import { Endpoint } from "@/api/Endpoint";

export function request<Response>(
  endpoint: Endpoint<Response, undefined, undefined>
): Promise<Response>;

export function request<Response, Data extends Record<string, unknown>>(
  endpoint: Endpoint<Response, Data, undefined>,
  params: undefined,
  data: Data
): Promise<Response>;

export function request<
  Response,
  Params extends Record<string, string | number | Date>
>(
  endpoint: Endpoint<Response, undefined, Params>,
  params: Params
): Promise<Response>;

export function request<
  Response,
  Data extends Record<string, unknown>,
  Params extends Record<string, string | number | Date>
>(
  endpoint: Endpoint<Response, Data, Params>,
  params: Params,
  data: Data
): Promise<Response>;

export async function request<Response>(
  endpoint: Endpoint<
    Response,
    Record<string, string | number | Date> | undefined,
    Record<string, string | number | Date> | undefined
  >,
  params: Record<string, string | number | Date> | undefined = undefined,
  data: Record<string, string | number | Date> | undefined = undefined
): Promise<Response> {
  let url = endpoint.resource;

  for (const param in params) {
    url = url.replace(`:${param}`, params[param].toString());
  }

  return axios
    .request<Response>({
      baseURL: "http://localhost:3000/",
      method: endpoint.method,
      url,
      data,
    })
    .then((req) => {
      return req.data;
    });
}
