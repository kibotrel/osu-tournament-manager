import type { Ref } from 'vue';
import { nextTick, ref } from 'vue';

export const useScroll = (
  target: Ref<HTMLElement | null>,
  options: { isInitiallyAtBottom: boolean },
) => {
  const isAtBottom = ref(options.isInitiallyAtBottom);

  const scrollToBottom = async () => {
    await nextTick();

    if (target.value) {
      /* eslint-disable-next-line no-param-reassign */
      target.value.scrollTop = target.value.scrollHeight;
      isAtBottom.value = true;
    }
  };

  const onScroll = () => {
    if (!target.value) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = target.value;

    isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 10;
  };

  return { isAtBottom, onScroll, scrollToBottom };
};
