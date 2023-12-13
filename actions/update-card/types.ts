import { z } from 'zod';
import { Board, Card } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-actions';

import { UpdateCard } from './schema';

export type InputType = z.infer<typeof UpdateCard>;
export type ReturnType = ActionState<InputType, Card>;