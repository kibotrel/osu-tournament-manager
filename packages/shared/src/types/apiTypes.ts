// POST /public/oauth

export interface PostPublicOauthRequestBody {
  code: string;
}

export interface PostPublicOauthResponseBody {
  avatarUrl: string;
  gameUserId: number;
  name: string;
}
