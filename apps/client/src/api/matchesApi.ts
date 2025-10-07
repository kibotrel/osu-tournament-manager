import type {
  CloseMatchResponseBody,
  CloseMatchResponseData,
  CreateMatchRequestBody,
  CreateMatchResponseBody,
  CreateMatchResponseData,
  GetMatchResponseBody,
  GetMatchResponseData,
  NothingRecord,
} from '@packages/shared';
import { getRequest, postRequest } from '@packages/shared';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { inject } from 'vue';
import type { Router } from 'vue-router';

import { baseUrl } from '#src/api/apiConstants.js';

const closeMatch = async (gameMatchId: number | string) => {
  const response = await postRequest<NothingRecord, CloseMatchResponseBody>({
    baseUrl,
    endpoint: `/matches/${gameMatchId}/close`,
    payload: {},
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as CloseMatchResponseData;
};

const createMatch = async (name: string) => {
  const response = await postRequest<
    CreateMatchRequestBody,
    CreateMatchResponseBody
  >({
    baseUrl,
    endpoint: '/matches',
    payload: { name },
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as CreateMatchResponseData;
};

const getMatch = async (gameMatchId: number | string) => {
  const response = await getRequest<NothingRecord, GetMatchResponseBody>({
    baseUrl,
    endpoint: `/matches/${gameMatchId}`,
    payload: {},
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as GetMatchResponseData;
};

/**
 * Close an existing match and its corresponding channel on bancho.
 */
export const useCloseMatch = () => {
  return useMutation<CloseMatchResponseData, Error, number>({
    mutationFn: async (gameMatchId) => {
      return await closeMatch(gameMatchId);
    },
    onError: (error) => {
      // TODO: Add a toast message here
      console.log(JSON.parse(error.message));
    },
  });
};

/**
 * Create a new match and open its corresponding channel on bancho.
 */
export const useCreateMatch = () => {
  const router = inject<Router>('$router');

  return useMutation<CreateMatchResponseData, Error, string>({
    mutationFn: async (name) => {
      return await createMatch(name);
    },
    onSuccess: (data) => {
      router?.push(`/matches/${data.gameMatchId}`);
    },
    onError: (error) => {
      // TODO: Add a toast message here
      console.log(JSON.parse(error.message));
    },
  });
};

/**
 * Fetch an existing match by its bancho channel id.
 */
export const useGetMatch = (
  gameMatchId: number,
  options: { enabled?: boolean; staleTime?: number } = {},
) => {
  const { enabled = true, staleTime = 0 } = options;

  return useQuery({
    enabled,
    queryFn: () => getMatch(gameMatchId),
    queryKey: ['match', gameMatchId],
    staleTime,
    retry: false,
  });
};
