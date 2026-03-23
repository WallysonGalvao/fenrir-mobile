export const errorToast = (queryKey: string, error: unknown): void => {
  console.error(`[Query Error] key=${queryKey}`, error);
};
