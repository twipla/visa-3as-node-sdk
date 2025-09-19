import { mock, mockClear } from "jest-mock-extended";
import { IntpApi } from "./intp-api";
import { HttpClient } from "../http-client";

describe("Websites", () => {
	let intpApi: IntpApi;
	let httpClient: HttpClient;

	beforeEach(() => {
		httpClient = mock<HttpClient>();
		intpApi = new IntpApi(httpClient);
	});

	afterEach(() => {
		mockClear(httpClient);
	});

	it("should call http-client get when get is called", async () => {
		await intpApi.get();
		expect(httpClient.get).toHaveBeenCalled();
	});
});
