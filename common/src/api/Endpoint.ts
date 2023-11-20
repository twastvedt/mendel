import type { AxiosRequestConfig, AxiosStatic } from "axios";
import axios from "axios";

type PartialAxios = Omit<AxiosRequestConfig, "data">;

/**
 * Methods supported by both Axios and Express.
 */
export type RestMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export class Endpoint<
  TParams extends
    | { [P in keyof TParams]: string | number | Date }
    | undefined = undefined,
  TData = undefined,
  TResponse = void
> {
  public constructor(public method: RestMethod, public resource: string = "") {}

  /**
   * Send a request to an endpoint.
   * @param config Route parameters to add to the url, body data to send, and optional Axios configuration.
   * @param axios Optional Axios instance to use instead of the default. (Configuration from config argument will still be applied.)
   */
  public async request(
    ...args: TParams extends undefined
      ? TData extends undefined
        ? [config?: PartialAxios, axios?: AxiosStatic]
        : [config: PartialAxios & { data: TData }, axios?: AxiosStatic]
      : TData extends undefined
      ? [config: PartialAxios & { routeParams: TParams }, axios?: AxiosStatic]
      : [
          config: PartialAxios & { data: TData; routeParams: TParams },
          axios?: AxiosStatic
        ]
  ): Promise<TResponse> {
    let url = this.resource;
    const [config, userAxios] = args;

    if (config && "routeParams" in config) {
      Object.entries(config.routeParams).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
      });
    }

    return (
      await (userAxios ?? axios).request<TResponse>({
        method: this.method,
        url,
        ...config,
      })
    ).data;
  }
}
