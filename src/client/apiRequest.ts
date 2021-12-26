import axios, { AxiosRequestConfig } from "axios";
import { Endpoint } from "@/api/Endpoint";

axios.defaults.baseURL = "http://localhost:3000/";

type PartialAxios = Omit<AxiosRequestConfig, "data">;

// type config<TData, TParams> = TData extends undefined ? TParams extends undefined ?

declare module "@/api/Endpoint" {
  interface Endpoint<
    TResponse,
    TData = undefined,
    TParams extends
      | { [P in keyof TParams]: string | number | Date }
      | undefined = undefined
  > {
    request(
      ...args: TData extends undefined
        ? TParams extends undefined
          ? [config?: PartialAxios]
          : [config: PartialAxios & { routeParams: TParams }]
        : TParams extends undefined
        ? [config: PartialAxios & { data: TData }]
        : [config: PartialAxios & { routeParams: TParams; data: TData }]
    ): Promise<TResponse>;
  }
}

Endpoint.prototype.request = async function request(
  config?: AxiosRequestConfig & {
    routeParams?: Record<string, string | number | Date>;
  }
): Promise<unknown> {
  let url = this.resource;

  if (config?.routeParams) {
    Object.entries(config.routeParams).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value.toString());
    });
  }

  return (
    await axios.request({
      method: this.method,
      url,
      ...config,
    })
  ).data;
};
