import { isClient } from '@utils';



export const isSSR = () => !isClient();