import type {
  CloseMatchResponseBody,
  CloseMatchResponseData,
  CreateMatchRequestBody,
  CreateMatchResponseBody,
  CreateMatchResponseData,
  NothingRecord,
} from '@packages/shared';
import { postRequest } from '@packages/shared';
import { useMutation } from '@tanstack/vue-query';
import { inject } from 'vue';
import type { Router } from 'vue-router';

import { baseUrl } from '#src/api/apiConstants.js';

const closeMatch = async (matchId: number) => {
  const response = await postRequest<NothingRecord, CloseMatchResponseBody>({
    baseUrl,
    endpoint: `/matches/${matchId}/close`,
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

/**
 * Close an existing match and its corresponding channel on bancho.
 */
export const useCloseMatch = () => {
  const router = inject<Router>('$router');

  return useMutation<CloseMatchResponseData, Error, number>({
    mutationFn: async (matchId) => {
      return await closeMatch(matchId);
    },
    onSuccess: () => {
      // TODO: Toaster here to indicate close or deletion depending on how far match went.

      router?.push(`/matches/create`);
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
      router?.push(`/matches/${data.id}`);
    },
    onError: (error) => {
      // TODO: Add a toast message here
      console.log(JSON.parse(error.message));
    },
  });
};
