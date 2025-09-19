import { HttpClient } from "./http-client";
import { VisaParams } from "./common";
import { IntpcApi } from "./intpcs";
import { IntpcsApi } from "./intpcs";
import { WebsiteApi, WebsitesApi } from "./websites";
import { PackagesApi } from "./packages";
import { AuthUtils } from "./common/auth/auth";
import { IFrameUtils } from "./common/iframe";
import { PackageApi } from "./packages/package-api";
import {IntpcSubscriptionsApi, WebsiteSubscriptionsApi} from "./subscriptions/subscriptions-api";
import {IntpApi} from "./intp";

export class VisitorAnalytics {
  #intpApi: IntpApi;
  #intpcApi: IntpcApi;
  #intpcsApi: IntpcsApi;
  #packageApi: PackageApi;
  #packagesApi: PackagesApi;
  #websiteApi: WebsiteApi;
  #websitesApi: WebsitesApi;
  #websiteSubscriptionApi: WebsiteSubscriptionsApi;
  #intpcSubscriptionApi: IntpcSubscriptionsApi;

  public auth: AuthUtils;

  #httpClient: HttpClient;

  constructor(private readonly params: VisaParams) {
    this.auth = new AuthUtils(params.intp);

    this.#httpClient = new HttpClient({
      accessToken: this.auth.generateINTPAccessToken(),
      env: params.env,
      logLevel: params.logLevel,
    });

	this.#intpApi = new IntpApi(this.#httpClient);
    this.#intpcApi = new IntpcApi(
      this.#httpClient,
      new IFrameUtils(this.auth, params.env)
    );
    this.#intpcsApi = new IntpcsApi(this.#httpClient);

    this.#websiteApi = new WebsiteApi(this.#httpClient);
    this.#websitesApi = new WebsitesApi(this.#httpClient);

    this.#packageApi = new PackageApi(this.#httpClient);
    this.#packagesApi = new PackagesApi(this.#httpClient);

    this.#websiteSubscriptionApi = new WebsiteSubscriptionsApi(this.#httpClient);
    this.#intpcSubscriptionApi = new IntpcSubscriptionsApi(this.#httpClient);
  }

  get intp(): IntpApi {
    return this.#intpApi;
  }

  get intpcs(): IntpcsApi {
    return this.#intpcsApi;
  }

  intpc(externalId: string): IntpcApi {
    return this.#intpcApi.setCustomerId(externalId);
  }

  get websites(): WebsitesApi {
    return this.#websitesApi;
  }

  website(externalId: string): WebsiteApi {
    return this.#websiteApi.setWebsiteId(externalId);
  }

  get packages(): PackagesApi {
    return this.#packagesApi;
  }

  package(id: string): PackageApi {
    return this.#packageApi.setPackageId(id);
  }

  get websiteSubscriptions(): WebsiteSubscriptionsApi {
    return this.#websiteSubscriptionApi;
  }

  get intpcSubscriptions(): IntpcSubscriptionsApi {
    return this.#intpcSubscriptionApi;
  }

  // For internal use. Don't use it unless you know what you're doing.
  get gatewayURL(): string {
	  return this.#httpClient.host;
  }
}
