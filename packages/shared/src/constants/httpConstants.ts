/**
 * List of common HTTP content types and when to use them.
 * see {@link https://www.iana.org/assignments/media-types/media-types.xhtml | IANA Content-Type}.
 */
export enum HttpContentType {
  /** JSON encoded as UTF-8. */
  ApplicationJson = 'application/json; charset=utf-8',
  /** Error message in JSON encoded as UTF-8. */
  ApplicationProblemJson = 'application/problem+json; charset=utf-8',
}

export enum HttpMethod {
  /** Remove an entity from the server. */
  Delete = 'DELETE',
  /** Retrieve data from a specified resource. */
  Get = 'GET',
  /** Partially update data on a specified resource. */
  Patch = 'PATCH',
  /** Create a new resource. */
  Post = 'POST',
  /** Update an existing resource. */
  Put = 'PUT',
}

/**
 * List of common HTTP headers and when to use them.
 * see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers | MDN HTTP Headers}.
 */
export enum HttpHeader {
  /** Contains the media type client is expecting in the response. */
  Accept = 'Accept',
  /** List of allowed methods on the corresponding resource. */
  Allow = 'Allow',
  /** Contains the credentials to authenticate client like a JWT token. */
  Authorization = 'Authorization',
  /** Size, in bytes, of the message body. */
  ContentLength = 'Content-Length',
  /** Media type of the resource. */
  ContentType = 'Content-Type',
  /**
   * Holds the cookie data sent previously by server
   * with {@link HttpHeader.SetCookie | SetCookie}
   */
  Cookie = 'Cookie',
  /** Date and time at which the message was sent. */
  Date = 'Date',
  /** Date and time after which the response might be not up-to-date. */
  Expires = 'Expires',
  /** Domain name of the server and optionally the TCP port number. */
  Host = 'Host',
  /** Last date and time at which the resource has been modified. */
  LastModified = 'Last-Modified',
  /** Location of the resource in case of a redirection. */
  Location = 'Location',
  /** Indicates the part of the resource server should return. */
  Range = 'Range',
  /**
   * Unique identifier for the request, used to track it across
   * the server and client.
   * This is typically set by the server.
   */
  RequestId = 'X-Request-Id',
  /** Time after which the client should retry the request. */
  RetryAfter = 'Retry-After',
  /** Contains various metrics about the server request processing. */
  ServerTiming = 'Server-Timing',
  /** Sends a cookie to the client to be stored for future requests. */
  SetCookie = 'Set-Cookie',
  /**
   * Contains the user agent string of the client containing various
   * information like operating system, browser, etc.
   */
  UserAgent = 'User-Agent',
}

/**
 * List of common HTTP status codes and when to use them.
 * see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status | MDN HTTP Status Codes}.
 */
export enum HttpStatusCode {
  /** Request has been accepted for later processing. */
  Accepted = 202,
  /**
   * Request couldn't be processed by the server because client input is either
   * invalid or missing.
   */
  BadRequest = 400,
  /**
   * Request has been successfully processed, creating a new resource along
   * with it.
   */
  Created = 201,
  /**
   * Request couldn't be processed by the server because client is authenticated
   * but doesn't have the necessary permissions to access the resource.
   */
  Forbidden = 403,
  /**
   * Request couldn't be processed by the server because of an unexpected error.
   * It is also used to avoid leaking sensitive information to the client.
   */
  InternalServerError = 500,
  /**
   * Request couldn't be processed by the server because the corresponding
   * resource is either not currently available or the implied action
   * is temporarily disabled for some reason like maintenance, ban,
   * archiving, etc.
   */
  Locked = 423,
  /**
   * Request couldn't be processed by the server because the method used is not
   * allowed on the corresponding resource. Response must include an `Allow`
   * header to inform the client about the allowed methods.
   */
  MethodNotAllowed = 405,
  /**
   * Request couldn't be processed by the server as the corresponding resource
   * has been moved to another location. This must be only used in a redirection
   * context along with the new location to reach. Only usable without user
   * interaction for `GET` or `HEAD` requests.
   */
  MovedPermanently = 301,
  /**
   * Request has been successfully processed but no response body is needed.
   * Typically used for `DELETE` requests.
   */
  NoContent = 204,
  /**
   * Request couldn't be processed by the server because the corresponding
   * resource couldn't be found.
   */
  NotFound = 404,
  /**
   * Request has been successfully processed, additional information can
   * be found in the response body.
   */
  Ok = 200,
  /**
   * Request has been successfully processed, response body contains
   * a subset of a resource collection. Quite useful to add semantic
   * to paginated resources.
   */
  PartialContent = 206,
  /**
   * Same as {@link HttpStatusCode.NoContent | NoContent} but the same verb
   * is used for the secondary request.
   */
  PermanentRedirect = 308,
  /**
   * Request couldn't be processed by the server or the corresponding resource
   * subset couldn't be found when using the `Range` header.
   */
  RangeNotSatisfiable = 416,
  /**
   * Request has been successfully processed and have expected side-effects.
   * This must be only used in a redirection context along with the location
   * to reach. Only usable for `GET` requests.
   */
  SeeOther = 303,
  /**
   * Request couldn't be processed by the server because the corresponding
   * resource is temporarily unavailable or the server is overloaded
   * like during a DDoS attack, maintenance or bug fixing.
   */
  ServiceUnavailable = 503,
  /**
   * Request couldn't be processed by the server because client is issuing
   * too many requests in a given amount of time.
   */
  TooManyRequests = 429,
  /**
   * Request couldn't be processed because client is not authenticated.
   */
  Unauthorized = 401,
  /**
   * Request couldn't be processed by the server because the corresponding
   * resource is forbidden according to client's country laws.
   */
  UnavailableForLegalReasons = 451,
  /**
   * Request couldn't be processed by the server even if it was a valid one
   * due to issues related to semantic, format, etc.
   */
  UnprocessableContent = 422,
}

/**
 * List of common HTTP status messages and when to use them.
 * see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status | MDN HTTP Status Codes}.
 */
export enum HttpStatusMessage {
  /** Request has been accepted for later processing. */
  Accepted = 'Accepted',
  /**
   * Request couldn't be processed by the server because client input is either
   * invalid or missing.
   */
  BadRequest = 'Bad Request',
  /**
   * Request has been successfully processed, creating a new resource along
   * with it.
   */
  Created = 'Created',
  /**
   * Request couldn't be processed by the server because client is authenticated
   * but doesn't have the necessary permissions to access the resource.
   */
  Forbidden = 'Forbidden',
  /**
   * Request couldn't be processed by the server because of an unexpected error.
   * It is also used to avoid leaking sensitive information to the client.
   */
  InternalServerError = 'Internal Server Error',
  /**
   * Request couldn't be processed by the server because the corresponding
   * resource is either not currently available or the implied action
   * is temporarily disabled for some reason like maintenance, ban,
   * archiving, etc.
   */
  Locked = 'Locked',
  /**
   * Request couldn't be processed by the server because the method used is not
   * allowed on the corresponding resource. Response must include an `Allow`
   * header to inform the client about the allowed methods.
   */
  MethodNotAllowed = 'Method Not Allowed',
  /**
   * Request couldn't be processed by the server as the corresponding resource
   * has been moved to another location. This must be only used in a redirection
   * context along with the new location to reach. Only usable without user
   * interaction for `GET` or `HEAD` requests.
   */
  MovedPermanently = 'Moved Permanently',
  /**
   * Request has been successfully processed but no response body is needed.
   * Typically used for `DELETE` requests.
   */
  NoContent = 'No Content',
  /**
   * Request couldn't be processed by the server because the corresponding
   * resource couldn't be found.
   */
  NotFound = 'Not Found',
  /**
   * Request has been successfully processed, additional information can
   * be found in the response body.
   */
  Ok = 'OK',
  /**
   * Request has been successfully processed, response body contains
   * a subset of a resource collection. Quite useful to add semantic
   * to paginated resources.
   */
  PartialContent = 'Partial Content',
  /**
   * Same as {@link HttpStatusCode.NoContent | NoContent} but the same verb
   * is used for the secondary request.
   */
  PermanentRedirect = 'Permanent Redirect',
  /**
   * Request couldn't be processed by the server or the corresponding resource
   * subset couldn't be found when using the `Range` header.
   */
  RangeNotSatisfiable = 'Range Not Satisfiable',
  /**
   * Request has been successfully processed and have expected side-effects.
   * This must be only used in a redirection context along with the location
   * to reach. Only usable for `GET` requests.
   */
  SeeOther = 'See Other',
  /**
   * Request couldn't be processed by the server because the corresponding
   * resource is temporarily unavailable or the server is overloaded
   * like during a DDoS attack, maintenance or bug fixing.
   */
  ServiceUnavailable = 'Service Unavailable',
  /**
   * Request couldn't be processed by the server because client is issuing
   * too many requests in a given amount of time.
   */
  TooManyRequests = 'Too Many Requests',
  /**
   * Request couldn't be processed because client is not authenticated.
   */
  Unauthorized = 'Unauthorized',
  /**
   * Request couldn't be processed by the server because the corresponding
   * resource is forbidden according to client's country laws.
   */
  UnavailableForLegalReasons = 'Unavailable For Legal Reasons',
  /**
   * Request couldn't be processed by the server even if it was a valid one
   * due to issues related to semantic, format, etc.
   */
  UnprocessableContent = 'Unprocessable Content',
}

/**
 * Mapping between {@link HttpStatusCode | HTTP status codes} and
 * {@link HttpStatusMessage | HTTP status messages}.
 */
export const HttpStatusCodesToMessagesMapping: {
  [key in HttpStatusCode]: HttpStatusMessage;
} = {
  [HttpStatusCode.Accepted]: HttpStatusMessage.Accepted,
  [HttpStatusCode.BadRequest]: HttpStatusMessage.BadRequest,
  [HttpStatusCode.Created]: HttpStatusMessage.Created,
  [HttpStatusCode.Forbidden]: HttpStatusMessage.Forbidden,
  [HttpStatusCode.InternalServerError]: HttpStatusMessage.InternalServerError,
  [HttpStatusCode.Locked]: HttpStatusMessage.Locked,
  [HttpStatusCode.MethodNotAllowed]: HttpStatusMessage.MethodNotAllowed,
  [HttpStatusCode.MovedPermanently]: HttpStatusMessage.MovedPermanently,
  [HttpStatusCode.NoContent]: HttpStatusMessage.NoContent,
  [HttpStatusCode.NotFound]: HttpStatusMessage.NotFound,
  [HttpStatusCode.Ok]: HttpStatusMessage.Ok,
  [HttpStatusCode.PartialContent]: HttpStatusMessage.PartialContent,
  [HttpStatusCode.PermanentRedirect]: HttpStatusMessage.PermanentRedirect,
  [HttpStatusCode.RangeNotSatisfiable]: HttpStatusMessage.RangeNotSatisfiable,
  [HttpStatusCode.SeeOther]: HttpStatusMessage.SeeOther,
  [HttpStatusCode.ServiceUnavailable]: HttpStatusMessage.ServiceUnavailable,
  [HttpStatusCode.TooManyRequests]: HttpStatusMessage.TooManyRequests,
  [HttpStatusCode.Unauthorized]: HttpStatusMessage.Unauthorized,
  [HttpStatusCode.UnavailableForLegalReasons]:
    HttpStatusMessage.UnavailableForLegalReasons,
  [HttpStatusCode.UnprocessableContent]: HttpStatusMessage.UnprocessableContent,
};
