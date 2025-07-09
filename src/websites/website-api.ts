import { HttpClient } from "../http-client";
import { ApiKey } from "./types/api-key";
import { CreateApiKey } from "./types/create-api-key";
import { Website } from "./types/website.type";

export class WebsiteApi {
  #externalWebsiteId: string = "";

  constructor(private readonly httpClient: HttpClient) { }

  public setWebsiteId(externalId: string): WebsiteApi {
    this.#externalWebsiteId = externalId;

    return this;
  }

  public async delete(): Promise<void> {
    await this.httpClient.delete<Website>(
      `/v2/3as/websites/${this.#externalWebsiteId}`
    );
  }

  public async addWhitelistedDomain(domain: string): Promise<void> {
    await this.httpClient.post<void>(
      `/v2/3as/websites/${this.#externalWebsiteId}/whitelisted-domains`,
      {
        domain
      }
    );
  }

  public async deleteWhitelistedDomain(domain: string): Promise<void> {
    await this.httpClient.update<void>(
      `/v2/3as/websites/${this.#externalWebsiteId}/whitelisted-domains/`, {
      domain
    }
    );
  }

  public async listWhitelistedDomains(): Promise<string[]> {
    const response = await this.httpClient.get<string[]>(
      `/v2/3as/websites/${this.#externalWebsiteId}/whitelisted-domains`
    );
    return response.getPayload()
  }

  public async createApiKey(input: CreateApiKey): Promise<ApiKey> {
    const response = await this.httpClient.post<ApiKey>(
      `/v2/3as/websites/${this.#externalWebsiteId}/api-keys`,
      input,
    )
    return response.getPayload()
  }

  public async listApiKeys(): Promise<ApiKey[]> {
    const response = await this.httpClient.get<ApiKey[]>(
      `/v2/3as/websites/${this.#externalWebsiteId}/api-keys`,
    )
    return response.getPayload()
  }

  public async deleteApiKey(id: string): Promise<void> {
    await this.httpClient.delete(
      `/v2/3as/websites/${this.#externalWebsiteId}/api-keys/${id}`,
    )
  }
}
