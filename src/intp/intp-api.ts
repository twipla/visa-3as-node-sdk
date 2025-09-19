import {Intp} from "./types";
import {HttpClient} from "../http-client";

export class IntpApi {
	#path: string = "/v2/3as/company-details";

	constructor(private readonly httpClient: HttpClient) { }

	async get(): Promise<Intp> {
		return (
			await this.httpClient.get<Intp>(this.#path)
		).getPayload();
	}
}
