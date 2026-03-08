import type {
  CloseMatchResponseBody,
  CloseMatchResponseData,
  CreateMatchRequestBody,
  CreateMatchResponseBody,
  CreateMatchResponseData,
  GetMatchChatHistoryResponseBody,
  GetMatchChatHistoryResponseData,
  GetMatchResponseBody,
  GetMatchResponseData,
  GetMatchStateResponseBody,
  GetMatchStateResponseData,
  NothingRecord,
} from '@packages/shared';
import { getRequest, postRequest } from '@packages/shared';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useTranslation } from 'i18next-vue';
import { inject } from 'vue';
import type { Router } from 'vue-router';

import { BASE_URL } from '#src/api/api.constants.js';
import { useToasterStore } from '#src/stores/toaster.store.js';

import { extractApiErrorMessageKeyFromError } from './api.methods.js';

const closeMatchRequest = async (gameMatchId: number | string) => {
  const response = await postRequest<NothingRecord, CloseMatchResponseBody>({
    baseUrl: BASE_URL,
    endpoint: `/matches/${gameMatchId}/close`,
    payload: {},
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as CloseMatchResponseData;
};

const createMatchRequest = async (name: string) => {
  const response = await postRequest<
    CreateMatchRequestBody,
    CreateMatchResponseBody
  >({
    baseUrl: BASE_URL,
    endpoint: '/matches',
    payload: { name },
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as CreateMatchResponseData;
};

const getMatchRequest = async (gameMatchId: number | string) => {
  const response = await getRequest<NothingRecord, GetMatchResponseBody>({
    baseUrl: BASE_URL,
    endpoint: `/matches/${gameMatchId}`,
    payload: {},
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as GetMatchResponseData;
};

const getMatchChatHistoryRequest = async (gameMatchId: number | string) => {
  const response = await getRequest<
    NothingRecord,
    GetMatchChatHistoryResponseBody
  >({
    baseUrl: BASE_URL,
    endpoint: `/matches/${gameMatchId}/chat-history`,
    payload: {},
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as GetMatchChatHistoryResponseData;
};

const getMatchStateRequest = async (gameMatchId: number | string) => {
  const response = await getRequest<NothingRecord, GetMatchStateResponseBody>({
    baseUrl: BASE_URL,
    endpoint: `/matches/${gameMatchId}/state`,
    payload: {},
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as GetMatchStateResponseData;
};

/**
 * Close an existing match and its corresponding channel on bancho.
 */
export const useCloseMatchRequest = () => {
  const router = inject<Router>('$router');
  const { newToast } = useToasterStore();
  const { t } = useTranslation();

  return useMutation<CloseMatchResponseData, Error, number>({
    mutationFn: async (gameMatchId) => {
      return await closeMatchRequest(gameMatchId);
    },
    onError: (error) => {
      const { errorName, translationKey } = extractApiErrorMessageKeyFromError(
        error,
        { namespace: 'matches.close' },
      );

      if (errorName === 'matchAlreadyClosed') {
        newToast.info(t(translationKey));
      } else {
        newToast.error(t(translationKey));
      }

      router?.push('/');
    },
  });
};

/**
 * Create a new match and open its corresponding channel on bancho.
 */
export const useCreateMatchRequest = () => {
  const router = inject<Router>('$router');
  const { newToast } = useToasterStore();
  const { t } = useTranslation();

  return useMutation<CreateMatchResponseData, Error, string>({
    mutationFn: async (name) => {
      return await createMatchRequest(name);
    },
    onSuccess: (data) => {
      router?.push(`/matches/${data.gameMatchId}`);
    },
    onError: (error) => {
      const { translationKey } = extractApiErrorMessageKeyFromError(error, {
        namespace: 'matches.create',
      });

      newToast.error(t(translationKey));
      router?.push('/');
    },
  });
};

/**
 * Fetch an existing match by its bancho channel id.
 */
export const useGetMatchRequest = (
  gameMatchId: number,
  options: { enabled?: boolean; staleTime?: number } = {},
) => {
  const { enabled = true, staleTime = 0 } = options;

  return useQuery({
    enabled,
    queryFn: async () => {
      return await getMatchRequest(gameMatchId);
    },
    queryKey: ['match', gameMatchId],
    staleTime,
    retry: false,
  });
};

/**
 * Fetch the chat history of an existing match by its bancho channel id.
 */
export const useGetMatchChatHistoryRequest = (
  gameMatchId: number | string,
  options: { enabled?: boolean; staleTime?: number } = {},
) => {
  const { enabled = true, staleTime = 0 } = options;

  return useQuery({
    enabled,
    queryFn: async () => {
      return await getMatchChatHistoryRequest(gameMatchId);
    },
    queryKey: ['match', gameMatchId, 'chat-history'],
    staleTime,
  });
};

/**
 * Fetch the lobby state of an existing match by its bancho channel id.
 */
export const useGetMatchStateRequest = (
  gameMatchId: number | string,
  options: { enabled?: boolean; staleTime?: number } = {},
) => {
  const { enabled = true, staleTime = 0 } = options;

  return useQuery({
    enabled,
    queryFn: async () => {
      return await getMatchStateRequest(gameMatchId);
    },
    queryKey: ['match', gameMatchId, 'state'],
    staleTime,
  });
};
