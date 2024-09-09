import { isSSR } from '@utils';
import { useEffect, useLayoutEffect } from 'react';



const _isSSR = isSSR();

export const useIsomorphicLayoutEffect = _isSSR ? useEffect : useLayoutEffect;