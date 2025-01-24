import { isSSR } from '@utils/isSSR';
import { useEffect, useLayoutEffect } from 'react';



const _isSSR = isSSR();

/**
 * A hook that conditionally uses `useEffect` or `useLayoutEffect`
 * based on whether the code is running in SSR or client-side.
 */
export const useIsomorphicLayoutEffect = _isSSR ? useEffect : useLayoutEffect;