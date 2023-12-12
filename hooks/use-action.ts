import { useState, useCallback, use } from 'react';

import { ActionState, FieldErrors } from "@/lib/create-safe-actions"

type Action<TInput, TOutput> = (data: TInput) =>
    Promise<ActionState<TInput, TOutput>>

interface useActionOptions<TOutput> {
    onSuccess?: (data: TOutput) => void;
    onError?: (errors: string) => void;
    onComplete?: () => void;
}

export const useAction = <TInput, TOutput>(
    action: Action<TInput, TOutput>,
    options: useActionOptions<TOutput> = {}
) => {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput> | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [data, setData] = useState<TOutput | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const execute = useCallback(
        async (input: TInput) => {
            setIsLoading(true);
            try {
                const result = await action(input);
                if (!result) return;


                setFieldErrors(result.fieldErrors);

                if (result.error) {
                    setError(result.error);
                    if (options.onError) {
                        options.onError(result.error);
                    }
                }
                if (result.data) {
                    setData(result.data);
                    if (options.onSuccess) {
                        options.onSuccess(result.data);
                    }
                }
            } finally {
                setIsLoading(false);
                if (options.onComplete) {
                    options.onComplete();
                }
            }
        }, [action, options]
    )

    return {
        execute,
        fieldErrors,
        error,
        data,
        isLoading,
    }
}