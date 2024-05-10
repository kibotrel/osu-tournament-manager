import { defineStore } from 'pinia';

export interface PlaceholderState {
  name: string;
}

export const usePlaceholderStore = defineStore('placeholder', {
  state: (): PlaceholderState => {
    return {
      name: 'unknown',
    };
  },

  actions: {
    setName(value: string) {
      this.name = value;
    },
  },

  /*
   * If you want to persist the state between page reloads,
   * sessions, etc. you can set this to true.
   */
  persist: false,
});
