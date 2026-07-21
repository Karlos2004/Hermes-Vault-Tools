/**
 * Returns an Error message or the supplied fallback for an unknown thrown value.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
