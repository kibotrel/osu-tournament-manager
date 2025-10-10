import type { Ref } from 'vue';
import { nextTick } from 'vue';

export const useScrollToBottomInElement = (target: Ref<HTMLElement | null>) => {
  const scrollToBottom = async () => {
    await nextTick();

    if (target.value) {
      /* eslint-disable-next-line no-param-reassign */
      target.value.scrollTop = target.value.scrollHeight;
    }
  };

  return { scrollToBottom };
};
