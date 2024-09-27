import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';
import { HttpRequest } from '#src/classes/httpRequestClass.js';

export interface RequestConfiguration {
  baseUrl: string;
  endpoint: string;
  payload?: Record<string, unknown>;
  version?: string;
}

export const deleteRequest = <T = Record<string, unknown>>(
  configuration: RequestConfiguration,
) => {
  const { baseUrl, endpoint, payload = {}, version = 'v1' } = configuration;
  const request = new HttpRequest()
    .setBaseUrl(`${baseUrl}/api/${version}`)
    .setPayload(payload);

  return request.delete<T>(endpoint);
};

export const getRequest = <T = Record<string, unknown>>(
  configuration: RequestConfiguration,
) => {
  const { baseUrl, endpoint, payload = {}, version = 'v1' } = configuration;
  const request = new HttpRequest()
    .setBaseUrl(`${baseUrl}/api/${version}`)
    .setPayload(payload);

  return request.get<T>(endpoint);
};

export const patchRequest = <T = Record<string, unknown>>(
  configuration: RequestConfiguration,
) => {
  const { baseUrl, endpoint, payload = {}, version = 'v1' } = configuration;
  const request = new HttpRequest()
    .setBaseUrl(`${baseUrl}/api/${version}`)
    .setPayload(payload);

  return request.patch<T>(endpoint);
};

export const postRequest = <T = Record<string, unknown>>(
  configuration: RequestConfiguration,
) => {
  const { baseUrl, endpoint, payload = {}, version = 'v1' } = configuration;
  const request = new HttpRequest()
    .setBaseUrl(`${baseUrl}/api/${version}`)
    .setPayload(payload);

  return request.post<T>(endpoint);
};

export const putRequest = <T = Record<string, unknown>>(
  configuration: RequestConfiguration,
) => {
  const { baseUrl, endpoint, payload = {}, version = 'v1' } = configuration;
  const request = new HttpRequest()
    .setBaseUrl(`${baseUrl}/api/${version}`)
    .setPayload(payload);

  return request.put<T>(endpoint);
};

export const isErrorReport = (input: unknown): input is ErrorReport => {
  return (
    typeof input === 'object' &&
    input !== null &&
    'instance' in input &&
    'status' in input &&
    'title' in input
  );
};
