import type { HttpStatusCode } from '#src/constants/httpConstants.js';
import { HttpHeader, HttpMethod } from '#src/constants/httpConstants.js';
import type { Nothing, Unknown } from '#src/types/utilityTypes.js';

export interface HttpResponse<ResponseType> {
  data: ResponseType;
  isOk: boolean;
  status: HttpStatusCode;
}

/**
 * Simple wrapper around the fetch API to make it easier to use.
 */
export class HttpRequest<PayloadType extends object = Nothing> {
  public baseApiEndpoint: string;
  public baseUrl: string;
  public httpHeaders: Headers;
  public payload: PayloadType | Nothing;
  public apiVersion: string;

  constructor() {
    this.baseApiEndpoint = '';
    this.baseUrl = '';
    this.httpHeaders = new Headers();
    this.payload = {};
    this.apiVersion = '';

    this.setHttpHeader(HttpHeader.ContentType, 'application/json');
  }

  public async delete<ResponseType = Unknown>(
    endpoint: string,
  ): Promise<HttpResponse<ResponseType>> {
    const url = this.setRequestQueryParams(endpoint);
    const response = await fetch(url, {
      headers: this.httpHeaders,
      method: HttpMethod.Delete,
    });
    const data = await this.readResponse<ResponseType>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  public async get<ResponseType = Unknown>(
    endpoint: string,
  ): Promise<HttpResponse<ResponseType>> {
    const url = this.setRequestQueryParams(endpoint);
    const response = await fetch(url, {
      headers: this.httpHeaders,
      method: HttpMethod.Get,
    });
    const data = await this.readResponse<ResponseType>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  public isPayloadEmpty(payload: PayloadType | Nothing): payload is Nothing {
    return Object.keys(payload).length === 0;
  }

  public async patch<ResponseType = Unknown>(
    endpoint: string,
  ): Promise<HttpResponse<ResponseType>> {
    this.setHttpHeader(HttpHeader.ContentType, 'application/json');

    const url = this.sanitizeUrl(endpoint);
    const response = await fetch(url, {
      body: this.setRequestBody(),
      headers: this.httpHeaders,
      method: HttpMethod.Patch,
    });
    const data = await this.readResponse<ResponseType>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  public async post<ResponseType = Unknown>(
    endpoint: string,
  ): Promise<HttpResponse<ResponseType>> {
    this.setHttpHeader(HttpHeader.ContentType, 'application/json');

    const url = this.sanitizeUrl(endpoint);
    const response = await fetch(url, {
      body: this.setRequestBody(),
      headers: this.httpHeaders,
      method: HttpMethod.Post,
    });
    const data = await this.readResponse<ResponseType>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  public async put<ResponseType = Unknown>(
    endpoint: string,
  ): Promise<HttpResponse<ResponseType>> {
    this.setHttpHeader(HttpHeader.ContentType, 'application/json');

    const url = this.sanitizeUrl(endpoint);
    const response = await fetch(url, {
      body: this.setRequestBody(),
      headers: this.httpHeaders,
      method: HttpMethod.Put,
    });
    const data = await this.readResponse<ResponseType>(response);

    return { data, isOk: response.ok, status: response.status };
  }

  /**
   * Internal method to safely parse the response from the fetch API.
   */
  private readResponse<ResponseType = Unknown>(
    response: Response,
  ): Promise<ResponseType> {
    return response.json().catch(() => {
      return {} as ResponseType;
    });
  }

  /**
   * Internal method to sanitize the URL before making the request. This will remove any double slashes
   * induced by non-set values for `baseUrl`, `baseApiEndpoint`, or `apiVersion`.
   */
  private sanitizeUrl(endpoint: string) {
    const url = `${this.baseUrl}/${this.baseApiEndpoint}/${this.apiVersion}/${endpoint}`;

    return new URL(url.replaceAll(/\/+/g, '/'));
  }

  /**
   * Will be prepended to the specified `endpoint` when invoking {@link HttpRequest.get}, {@link HttpRequest.post}, etc.
   */
  public setApiVersion(version: string) {
    this.apiVersion = version;

    return this;
  }

  /**
   * Will be appended to specified `baseUrl` when invoking {@link HttpRequest.get}, {@link HttpRequest.post}, etc.
   */
  public setBaseApiEndpoint(baseApiEndpoint: string) {
    this.baseApiEndpoint = baseApiEndpoint;

    return this;
  }

  /**
   * Will be prepended to the specified `endpoint` when invoking {@link HttpRequest.get}, {@link HttpRequest.post}, etc.
   */
  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;

    return this;
  }

  /**
   * Adds a header to the request. See {@link HttpHeader} for a list of available headers.
   */
  public setHttpHeader(name: HttpHeader, value: string) {
    this.httpHeaders.set(name, value);

    return this;
  }

  /**
   * This will be used to set either the query parameters or the body of the request.
   */
  public setPayload(payload: PayloadType | Nothing) {
    if (!this.isPayloadEmpty(payload)) {
      this.payload = payload;
    }

    return this;
  }

  /**
   * Internal method to set the body of the request.
   */
  private setRequestBody() {
    if (this.isPayloadEmpty(this.payload)) {
      return null;
    }

    return JSON.stringify(this.payload);
  }

  /**
   * Internal method to set the query parameters of the request.
   */
  private setRequestQueryParams(endpoint: string) {
    const url = this.sanitizeUrl(endpoint);

    if (!this.isPayloadEmpty(this.payload)) {
      for (const key in this.payload) {
        url.searchParams.append(key, String(this.payload[key]));
      }
    }

    return url;
  }
}
