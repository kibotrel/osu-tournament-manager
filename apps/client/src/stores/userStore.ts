import { defineStore } from 'pinia';
import { reactive } from 'vue';

export interface UserState {
  avatarUrl: string;
  gameUserId: number;
  isLoggedIn: boolean;
  name: string;
}

export const useUserStore = defineStore(
  'user',
  () => {
    const defaultState = {
      avatarUrl: '',
      gameUserId: 0,
      isLoggedIn: false,
      name: '',
    };
    const user = reactive<UserState>({ ...defaultState });

    const resetUser = () => {
      Object.assign(user, defaultState);
    };

    const setUser = (newUser: UserState) => {
      Object.assign(user, newUser);
    };

    return { user, resetUser, setUser };
  },
  { persist: true },
);
