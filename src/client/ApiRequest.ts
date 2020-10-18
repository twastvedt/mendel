import axios from "axios";
import { Endpoint } from "@/api/Endpoint";

export async function request<
  Response,
  Data extends Record<string, unknown> | undefined,
  Params extends Record<string, string> | undefined
>(
  endpoint: Endpoint<Response, Data, Params>,
  data: Data,
  params: Params
): Promise<Response> {
  const url = endpoint.resource;

  for (const param in params) {
    url.replace(`:${param}`, params[param]);
  }

  return axios
    .request<Response>({
      baseURL: "http://localhost:8081/",
      method: endpoint.method,
      url,
      data,
    })
    .then((req) => {
      return req.data;
    });
}
