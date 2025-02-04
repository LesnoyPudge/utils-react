import { isClient } from '@utils/isClient';



/**
 * Checks if the code is running in a server-side environment.
 */
export const isSSR = () => !isClient();