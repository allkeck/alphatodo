import { RefObject, useEffect } from 'react';

export const useHandleToClose = <T extends HTMLElement>(ref: RefObject<T>, handler: () => void) => {
  const listener = (event: TouchEvent | MouseEvent) => {
    const target = event.target as Node;

    if (ref.current && ref.current.contains(target)) return;

    handler();
  };

  const escListener = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handler();
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', listener);
    document.addEventListener('touchstart', listener);
    document.addEventListener('keyup', escListener);

    return () => {
      document.removeEventListener('mouseup', listener);
      document.removeEventListener('touchstart', listener);
      document.removeEventListener('keyup', escListener);
    };
  });
};
