import { useIntersectionObserver } from '@vueuse/core';
import type { ShallowRef } from 'vue';
import { nextTick, onUnmounted, shallowRef, watch } from 'vue';

const elementStack: Array<ShallowRef<HTMLElement | null>> = [];
const focusableSelectors = [
  '[tabindex]:not([tabindex="-1"])',
  'a[href]',
  'button:not([disabled])',
  'details',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
];

const isTopElement = (element: Readonly<ShallowRef<HTMLElement | null>>) => {
  return elementStack.at(-1) === element;
};

const trapFocus = async (target: HTMLElement) => {
  await nextTick();

  const focusableElements = target.querySelectorAll<HTMLElement>(
    focusableSelectors.join(','),
  );

  focusableElements[0]?.focus();
};

export const usePopUpBehavior = ({
  element,
  onClose,
}: {
  element: Readonly<ShallowRef<HTMLElement | null>>;
  onClose: () => void;
}) => {
  const isElementVisible = shallowRef(false);

  useIntersectionObserver(element, ([{ isIntersecting }]) => {
    isElementVisible.value = isIntersecting || false;
  });

  const closeOnEscape = (event: KeyboardEvent) => {
    event.stopPropagation();

    if (event.key === 'Escape' && isTopElement(element)) {
      onClose();
    }
  };

  const closeOnClickOutside = (event: MouseEvent) => {
    if (!isTopElement(element)) {
      return;
    }

    const target = event.target as Node;

    if (element && element.value && !element.value.contains(target)) {
      onClose();
    }
  };

  const tabNavigation = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !element.value || !isTopElement(element)) {
      return;
    }

    const focusableElements = element.value.querySelectorAll<HTMLElement>(
      focusableSelectors.join(','),
    );
    const focusable = [...focusableElements];

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable.at(-1);
    const active = document.activeElement;

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    }
  };

  watch(isElementVisible, async (isVisible) => {
    if (isVisible && element.value) {
      elementStack.push(element);
      window.addEventListener('keydown', closeOnEscape);
      window.addEventListener('keydown', tabNavigation);
      window.addEventListener('mousedown', closeOnClickOutside);

      await trapFocus(element.value);
    } else {
      elementStack.pop();
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('keydown', tabNavigation);
      window.removeEventListener('mousedown', closeOnClickOutside);

      await nextTick();

      const previousElement = elementStack.at(-1);

      if (previousElement && previousElement.value) {
        await trapFocus(previousElement.value);
      }
    }
  });

  onUnmounted(async () => {
    elementStack.pop();
    window.removeEventListener('keydown', closeOnEscape);
    window.removeEventListener('keydown', tabNavigation);
    window.removeEventListener('mousedown', closeOnClickOutside);

    await nextTick();

    const previousElement = elementStack.at(-1);

    if (previousElement && previousElement.value) {
      await trapFocus(previousElement.value);
    }
  });

  return { isElementVisible };
};
