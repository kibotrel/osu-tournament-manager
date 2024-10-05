import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';
import { HttpRequest } from '#src/classes/httpRequestClass.js';
import { HttpHeaders } from '#src/constants/httpConstants.js';
import type { Nothing } from '#src/types/utilityTypes.js';

export interface RequestConfiguration<PayloadType> {
  baseUrl: string;
  endpoint: string;
  baseApiEndpoint?: string;
  payload: PayloadType extends Nothing ? Nothing : PayloadType;
  token?: string;
  apiVersion?: string;
}

const createGenericRequest = <PayloadType extends object = Nothing>(
  configuration: RequestConfiguration<PayloadType>,
) => {
  const {
    baseApiEndpoint = 'api',
    baseUrl,
    payload,
    token,
    apiVersion = 'v1',
  } = configuration;
  const request = new HttpRequest<PayloadType>()
    .setBaseUrl(baseUrl)
    .setBaseApiEndpoint(baseApiEndpoint)
    .setApiVersion(apiVersion)
    .setPayload(payload);

  if (token) {
    request.setHttpHeader(HttpHeaders.Authorization, `Bearer ${token}`);
  }

  return request;
};

export const deleteRequest = <
  PayloadType extends object = Nothing,
  ResponseType = Nothing,
>(
  configuration: RequestConfiguration<PayloadType>,
) => {
  const { endpoint } = configuration;
  const request = createGenericRequest<PayloadType>(configuration);

  return request.delete<ResponseType>(endpoint);
};

export const getRequest = <
  PayloadType extends object = Nothing,
  ResponseType = Nothing,
>(
  configuration: RequestConfiguration<PayloadType>,
) => {
  const { endpoint } = configuration;
  const request = createGenericRequest<PayloadType>(configuration);

  return request.get<ResponseType>(endpoint);
};

export const patchRequest = <
  PayloadType extends object = Nothing,
  ResponseType = Nothing,
>(
  configuration: RequestConfiguration<PayloadType>,
) => {
  const { endpoint } = configuration;
  const request = createGenericRequest<PayloadType>(configuration);

  return request.patch<ResponseType>(endpoint);
};

export const postRequest = <
  PayloadType extends object = Nothing,
  ResponseType = Nothing,
>(
  configuration: RequestConfiguration<PayloadType>,
) => {
  const { endpoint } = configuration;
  const request = createGenericRequest<PayloadType>(configuration);

  return request.post<ResponseType>(endpoint);
};

export const putRequest = <
  PayloadType extends object = Nothing,
  ResponseType = Nothing,
>(
  configuration: RequestConfiguration<PayloadType>,
) => {
  const { endpoint } = configuration;
  const request = createGenericRequest<PayloadType>(configuration);

  return request.put<ResponseType>(endpoint);
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
