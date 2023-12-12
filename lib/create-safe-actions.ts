import { Action } from '@prisma/client/runtime/library';
import { z } from 'zod';

export type FieldErrors<T> = {
    [k in keyof T]?: string[]
}

export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>;
    error?: string | null
    data?: TOutput 
}

export const CreateSafeActions = <TInput, TOutput>(
    schema: z.Schema<TInput>,
    handler: (validateData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
    return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
        const validationResult = schema.safeParse(data);
        if (!validationResult.success) {
            return {
                fieldErrors: validationResult.error.flatten().fieldErrors as
                    FieldErrors<TInput>
            }
        }
        return await handler(validationResult.data);
    }
}