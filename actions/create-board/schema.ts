import { z } from 'zod';

export const CreateBoard = z.object({
    title: z.string({
        required_error: 'Board title is required',
        invalid_type_error: 'Board title must be a string'
    }).min(3, {
        message: 'Title is too short'
    }),
    image: z.string({
        required_error: 'Board image is required',
        invalid_type_error: 'Board image must be a string'
    }),
})