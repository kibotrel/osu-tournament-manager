import type { HttpStatusCodes } from '#src/constants/httpConstants.js';
import { HttpHeaders, HttpMethods } from '#src/constants/httpConstants.js';

export interface HttpResponse<T> {
  data: T;
  isOk: boolean;
  status: HttpStatusCodes;
}

/**
 * Simple wrapper around the fetch API to make it easier to use.
 */
export class HttpRequest {
  public baseUrl: string;
  public httpHeaders: Headers;
  public payload: Record<string, unknown>;

  constructor() {
    this.baseUrl = '';
    this.httpHeaders = new Headers();
    this.payload = {};

    this.setHttpHeader(HttpHeaders.ContentType, 'application/json');
  }

  public async delete<T = Record<string, unknown>>(
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    const url = this.setRequestQueryParams(endpoint);
    const response = await fetch(url, {
      headers: this.httpHeaders,
      method: HttpMethods.Delete,
    });
    const data = await this.readResponse<T>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  public async get<T = Record<string, unknown>>(
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    const url = this.setRequestQueryParams(endpoint);
    const response = await fetch(url, {
      headers: this.httpHeaders,
      method: HttpMethods.Get,
    });
    const data = await this.readResponse<T>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  public async patch<T = Record<string, unknown>>(
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    this.setHttpHeader(HttpHeaders.ContentType, 'application/json');

    const url = new URL(`${this.baseUrl}${endpoint}`);
    const response = await fetch(url, {
      body: this.setRequestBody(),
      headers: this.httpHeaders,
      method: HttpMethods.Patch,
    });
    const data = await this.readResponse<T>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  public async post<T = Record<string, unknown>>(
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    this.setHttpHeader(HttpHeaders.ContentType, 'application/json');

    const url = new URL(`${this.baseUrl}${endpoint}`);
    const response = await fetch(url, {
      body: this.setRequestBody(),
      headers: this.httpHeaders,
      method: HttpMethods.Post,
    });
    const data = await this.readResponse<T>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  public async put<T = Record<string, unknown>>(
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    this.setHttpHeader(HttpHeaders.ContentType, 'application/json');

    const url = new URL(`${this.baseUrl}${endpoint}`);
    const response = await fetch(url, {
      body: this.setRequestBody(),
      headers: this.httpHeaders,
      method: HttpMethods.Put,
    });
    const data = await this.readResponse<T>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  /**
   * Internal method to safely parse the response from the fetch API.
   */
  private readResponse<T = Record<string, unknown>>(
    response: Response,
  ): Promise<T> {
    return response.json().catch(() => {
      return {} as T;
    });
  }

  /**
   * Will be prepended to the specified endpoint when invoking {@link HttpRequest.get}, {@link HttpRequest.post}, etc.
   */
  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;

    return this;
  }

  /**
   * Adds a header to the request. See {@link HttpHeaders} for a list of available headers.
   */
  public setHttpHeader(name: HttpHeaders, value: string) {
    this.httpHeaders.set(name, value);

    return this;
  }

  /**
   * This will be used to set either the query parameters or the body of the request.
   */
  public setPayload(payload?: Record<string, unknown>) {
    this.payload = payload ?? {};

    return this;
  }

  /**
   * Internal method to set the body of the request.
   */
  private setRequestBody() {
    if (Object.keys(this.payload).length > 0) {
      return JSON.stringify(this.payload);
    }

    return null;
  }

  /**
   * Internal method to set the query parameters of the request.
   */
  private setRequestQueryParams(endpoint: string) {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    for (const key in this.payload) {
      url.searchParams.append(key, String(this.payload[key]));
    }

    return url;
  }
}
