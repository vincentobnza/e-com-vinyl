export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string; errors?: Record<string, string[] | string> } };
  };
  const data = err.response?.data;
  if (!data) return fallback;
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  const errors = data.errors;
  if (errors && typeof errors === "object") {
    for (const value of Object.values(errors)) {
      if (Array.isArray(value) && value[0] != null) return String(value[0]);
      if (typeof value === "string" && value.trim()) return value;
    }
  }
  return fallback;
}
