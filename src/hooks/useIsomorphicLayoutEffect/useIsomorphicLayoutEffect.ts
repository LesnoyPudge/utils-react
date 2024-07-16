import { isSSR } from '@utils';
import { useEffect, useLayoutEffect } from 'react';



export const useIsomorphicLayoutEffect = isSSR() ? useEffect : useLayoutEffect;