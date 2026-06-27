export function isFirestoreUnavailable(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const err = error as { code?: number | string; reason?: string; message?: string };

  return (
    err.code === 5 ||
    err.code === 7 ||
    err.code === "5" ||
    err.code === "7" ||
    err.reason === "SERVICE_DISABLED" ||
    err.message?.includes("NOT_FOUND") ||
    err.message?.includes("Firestore API has not been used") ||
    err.message?.includes("SERVICE_DISABLED")
  );
}
