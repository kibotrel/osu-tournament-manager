import { useIntersectionObserver } from '@vueuse/core';
import type { ShallowRef } from 'vue';
import { onUnmounted, shallowRef, watch } from 'vue';

export const useEscapeBehavior = ({
  onEscape,
  target,
}: {
  onEscape: () => void;
  target: Readonly<ShallowRef>;
}) => {
  const targetIsVisible = shallowRef(false);

  useIntersectionObserver(target, ([{ isIntersecting }]) => {
    targetIsVisible.value = isIntersecting || false;
  });

  const handleKeydown = (event: KeyboardEvent) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      onEscape();
    }
  };

  watch(targetIsVisible, (isVisible) => {
    if (isVisible) {
      window.addEventListener('keydown', handleKeydown);
    } else {
      window.removeEventListener('keydown', handleKeydown);
    }
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });

  return { targetIsVisible };
};
