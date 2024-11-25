import { createHookComponent } from '@utils/createHookComponent';
import { useId } from 'react';



export const Id = createHookComponent('Id', () => useId());