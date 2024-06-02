import type { HttpStatusCodes } from '../constants/httpConstants.js';
import { HttpHeaders, HttpMethods } from '../constants/httpConstants.js';

export enum HandledDomains {
  Internal = 'internal',
  Osu = 'osu',
}

export interface HttpResponse<T> {
  data: T;
  isOk: boolean;
  status: HttpStatusCodes;
}

export interface HttpRequestOptions {
  domain?: 'internal' | 'osu';
  token?: string;
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
    const options: RequestInit = {
      headers: this.httpHeaders,
      method: HttpMethods.Delete,
    };
    const url = new URL(`${this.baseUrl}${endpoint}`);

    for (const key in this.payload) {
      url.searchParams.append(key, String(this.payload[key]));
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return { data, isOk: response.ok, status: response.status };
  }

  public async get<T = Record<string, unknown>>(
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    const options: RequestInit = {
      headers: this.httpHeaders,
      method: HttpMethods.Get,
    };
    const url = new URL(`${this.baseUrl}${endpoint}`);

    for (const key in this.payload) {
      url.searchParams.append(key, String(this.payload[key]));
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return { data, isOk: response.ok, status: response.status };
  }

  public async patch<T = Record<string, unknown>>(
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    const options: RequestInit = {
      headers: this.httpHeaders,
      method: HttpMethods.Patch,
    };
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (Object.keys(this.payload).length > 0) {
      options.body = JSON.stringify(this.payload);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return { data, isOk: response.ok, status: response.status };
  }

  public async post<T = Record<string, unknown>>(
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    const options: RequestInit = {
      headers: this.httpHeaders,
      method: HttpMethods.Post,
    };
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (Object.keys(this.payload).length > 0) {
      options.body = JSON.stringify(this.payload);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return { data, isOk: response.ok, status: response.status };
  }

  public async put<T = Record<string, unknown>>(
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    const options: RequestInit = {
      headers: this.httpHeaders,
      method: HttpMethods.Put,
    };
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (Object.keys(this.payload).length > 0) {
      options.body = JSON.stringify(this.payload);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return { data, isOk: response.ok, status: response.status };
  }

  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;

    return this;
  }

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
}
