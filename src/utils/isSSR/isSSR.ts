import { isClient } from '@utils/isClient';



export const isSSR = () => !isClient();