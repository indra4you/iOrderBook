export type DataStatus<TData> = {
    isLoading: boolean,
    error: Error | null,
    data: TData | null,
    hasData: boolean | null,
};