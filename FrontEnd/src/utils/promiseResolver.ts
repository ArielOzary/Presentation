export const promiseResolver: {
  <T>(val: T): Promise<[Awaited<T> | null, Error | null]>
} = async <T>(promise: T) => {
  try {
    const data = await promise
    return [data, null]
  } catch (err) {
    return [null, err as Error]
  }
}
