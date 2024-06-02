/**
 * List of common HTTP content types and when to use them.
 * see {@link https://www.iana.org/assignments/media-types/media-types.xhtml | IANA Content-Type}.
 */
export enum HttpContentTypes {
  /** JSON encoded as UTF-8. */
  ApplicationJson = 'application/json; charset=utf-8',
  /** Error message in JSON encoded as UTF-8. */
  ApplicationProblemJson = 'application/problem+json; charset=utf-8',
}

export enum HttpMethods {
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
export enum HttpHeaders {
  /** Contains the media type client is expecting in the response. */
  Accept = 'Accept',
  /** List of allowed methods on the corresponding ressource. */
  Allow = 'Allow',
  /** Contains the credentials to authenticate client like a JWT token. */
  Authorization = 'Authorization',
  /** Size, in bytes, of the message body. */
  ContentLength = 'Content-Length',
  /** Media type of the ressource. */
  ContentType = 'Content-Type',
  /**
   * Holds the cookie data sent previously by server
   * with {@link HttpHeaders.SetCookie | SetCookie}
   */
  Cookie = 'Cookie',
  /** Date and time at which the message was sent. */
  Date = 'Date',
  /** Date and time after which the response might be not up-to-date. */
  Expires = 'Expires',
  /** Domain name of the server and optionally the TCP port number. */
  Host = 'Host',
  /** Last date and time at which the ressource has been modified. */
  LastModified = 'Last-Modified',
  /** Location of the ressource in case of a redirection. */
  Location = 'Location',
  /** Indicates the part of the ressource server should return. */
  Range = 'Range',
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
export enum HttpStatusCodes {
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
   * but doesn't have the necessary permissions to access the ressource.
   */
  Forbidden = 403,
  /**
   * Request couldn't be processed by the server because of an unexpected error.
   * It is also used to avoid leaking sensitive information to the client.
   */
  InternalServerError = 500,
  /**
   * Request couldn't be processed by the server because the corresponding
   * ressource is either not currently available or the implied action
   * is temporarily disabled for some reason like maintenance, ban,
   * archiving, etc.
   */
  Locked = 423,
  /**
   * Request couldn't be processed by the server because the method used is not
   * allowed on the corresponding ressource. Response must include an `Allow`
   * header to inform the client about the allowed methods.
   */
  MethodNotAllowed = 405,
  /**
   * Request couldn't be processed by the server as the corresponding ressource
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
   * ressource couldn't be found.
   */
  NotFound = 404,
  /**
   * Request has been successfully processed, additional information can
   * be found in the response body.
   */
  Ok = 200,
  /**
   * Request has been successfully processed, response body contains
   * a subset of a ressource collection. Quite useful to add semantic
   * to paginable resources.
   */
  PartialContent = 206,
  /**
   * Same as {@link HttpStatusCodes.NoContent | NoContent} but the same verb
   * is used for the secondary request.
   */
  PermanentRedirect = 308,
  /**
   * Request couldn't be processed by the server or the corresponding ressource
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
   * ressource is temporarily unavailable or the server is overloaded
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
   * ressource is forbidden according to client's country laws.
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
export enum HttpStatusMessages {
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
   * but doesn't have the necessary permissions to access the ressource.
   */
  Forbidden = 'Forbidden',
  /**
   * Request couldn't be processed by the server because of an unexpected error.
   * It is also used to avoid leaking sensitive information to the client.
   */
  InternalServerError = 'Internal Server Error',
  /**
   * Request couldn't be processed by the server because the corresponding
   * ressource is either not currently available or the implied action
   * is temporarily disabled for some reason like maintenance, ban,
   * archiving, etc.
   */
  Locked = 'Locked',
  /**
   * Request couldn't be processed by the server because the method used is not
   * allowed on the corresponding ressource. Response must include an `Allow`
   * header to inform the client about the allowed methods.
   */
  MethodNotAllowed = 'Method Not Allowed',
  /**
   * Request couldn't be processed by the server as the corresponding ressource
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
   * ressource couldn't be found.
   */
  NotFound = 'Not Found',
  /**
   * Request has been successfully processed, additional information can
   * be found in the response body.
   */
  Ok = 'OK',
  /**
   * Request has been successfully processed, response body contains
   * a subset of a ressource collection. Quite useful to add semantic
   * to paginable resources.
   */
  PartialContent = 'Partial Content',
  /**
   * Same as {@link HttpStatusCodes.NoContent | NoContent} but the same verb
   * is used for the secondary request.
   */
  PermanentRedirect = 'Permanent Redirect',
  /**
   * Request couldn't be processed by the server or the corresponding ressource
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
   * ressource is temporarily unavailable or the server is overloaded
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
   * ressource is forbidden according to client's country laws.
   */
  UnavailableForLegalReasons = 'Unavailable For Legal Reasons',
  /**
   * Request couldn't be processed by the server even if it was a valid one
   * due to issues related to semantic, format, etc.
   */
  UnprocessableContent = 'Unprocessable Content',
}

/**
 * Mapping between {@link HttpStatusCodes | HTTP status codes} and
 * {@link HttpStatusMessages | HTTP status messages}.
 */
export const HttpStatusCodesToMessagesMapping: {
  [key in HttpStatusCodes]: HttpStatusMessages;
} = {
  [HttpStatusCodes.Accepted]: HttpStatusMessages.Accepted,
  [HttpStatusCodes.BadRequest]: HttpStatusMessages.BadRequest,
  [HttpStatusCodes.Created]: HttpStatusMessages.Created,
  [HttpStatusCodes.Forbidden]: HttpStatusMessages.Forbidden,
  [HttpStatusCodes.InternalServerError]: HttpStatusMessages.InternalServerError,
  [HttpStatusCodes.Locked]: HttpStatusMessages.Locked,
  [HttpStatusCodes.MethodNotAllowed]: HttpStatusMessages.MethodNotAllowed,
  [HttpStatusCodes.MovedPermanently]: HttpStatusMessages.MovedPermanently,
  [HttpStatusCodes.NoContent]: HttpStatusMessages.NoContent,
  [HttpStatusCodes.NotFound]: HttpStatusMessages.NotFound,
  [HttpStatusCodes.Ok]: HttpStatusMessages.Ok,
  [HttpStatusCodes.PartialContent]: HttpStatusMessages.PartialContent,
  [HttpStatusCodes.PermanentRedirect]: HttpStatusMessages.PermanentRedirect,
  [HttpStatusCodes.RangeNotSatisfiable]: HttpStatusMessages.RangeNotSatisfiable,
  [HttpStatusCodes.SeeOther]: HttpStatusMessages.SeeOther,
  [HttpStatusCodes.ServiceUnavailable]: HttpStatusMessages.ServiceUnavailable,
  [HttpStatusCodes.TooManyRequests]: HttpStatusMessages.TooManyRequests,
  [HttpStatusCodes.Unauthorized]: HttpStatusMessages.Unauthorized,
  [HttpStatusCodes.UnavailableForLegalReasons]:
    HttpStatusMessages.UnavailableForLegalReasons,
  [HttpStatusCodes.UnprocessableContent]:
    HttpStatusMessages.UnprocessableContent,
};
