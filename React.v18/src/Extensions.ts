export function hasNoValue<T>(
    value: T[] | null | undefined,
): boolean {
    return value === undefined ||
        value === null ||
        value.length === 0;
};

export function isNullOrEmpty(
    value: string | null | undefined,
): boolean {
    return value === undefined ||
        value === null ||
        value.trim().length === 0;
};

export function isNotNullOrEmpty(
    value: string | null | undefined,
): boolean {
    return !isNullOrEmpty(
        value
    );
};