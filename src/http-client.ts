import axios, { Axios, AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { Logger } from "./common/logging/logger";
import { LogLevel } from "./common/logging/types";
import { Response, VisaApiResponse } from "./response";
import { AccessToken } from "./token-signing";

axiosRetry(axios, { retries: 3 });

export class HttpClient {
  DEV_API_GATEWAY_URI = "https://api-gateway.va-endpoint.com";
  STAGE_API_GATEWAY_URI = "https://stage-api-gateway.va-endpoint.com";
  PRODUCTION_API_GATEWAY_URI = "https://api-gateway.visitor-analytics.io";

  #host: string;
  #accessToken: AccessToken;

  #http: Axios;
  #logger: Logger;

  constructor(params: {
    readonly accessToken: AccessToken;
    readonly logLevel: LogLevel;
    readonly env: "dev" | "stage" | "production";
  }) {
    this.#http = axios;

    switch (params.env) {
      case "dev":
        this.#host = this.DEV_API_GATEWAY_URI;
        break;
      case "stage":
        this.#host = this.STAGE_API_GATEWAY_URI;
        break;
      case "production":
        this.#host = this.PRODUCTION_API_GATEWAY_URI;
        break;
      default:
        throw new Error("Unsupported env: " + params.env);
    }

    this.#accessToken = params.accessToken;

    this.#logger = new Logger({
      env: params.env,
      level: params.logLevel,
    });

    this.#logger.logDebug(this.#accessToken);
  }

  #routeCreate(axiosMethod: "post" | "get" | "patch" | "delete") {
    return async <T>(path: string, payload?: unknown): Promise<Response<T>> => {
      if (this.#accessToken.isExpired) {
        this.#accessToken = this.#accessToken.refresh();

        this.#logger.logInfo("Refreshed access token.");
        this.#logger.logDebug(this.#accessToken.value);
      }

      this.#logger.logInfo({
        method: axiosMethod.toUpperCase(),
        path: this.#host + path,
        payload,
        accessToken: this.#accessToken.value,
      });

      try {
        let response;
        if (payload && axiosMethod !== "get" && axiosMethod !== "delete") {
          response = await this.#http[axiosMethod]<VisaApiResponse<T>>(
            this.#host + path,
            payload,
            {
              headers: {
                Authorization: "Bearer " + this.#accessToken.value,
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          response = await this.#http[axiosMethod]<VisaApiResponse<T>>(
            this.#host + path,
            {
              headers: {
                Authorization: "Bearer " + this.#accessToken.value,
                Accept: "application/json",
              },
            }
          );
        }
        this.#logger.logDebug(response.data as unknown as object);

        return new Response<T>(response);
      } catch (error) {
        throw (error as AxiosError).response?.data;
      }
    };
  }

  get host() {
	return this.#host;
  }

  post = this.#routeCreate("post");
  get = this.#routeCreate("get");
  update = this.#routeCreate("patch");
  delete = this.#routeCreate("delete");
}
