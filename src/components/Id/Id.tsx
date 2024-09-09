import { createHookComponent } from '@utils';
import { useId } from 'react';



export const Id = createHookComponent('Id', () => useId());