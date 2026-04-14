export function createId(prefix: string) {
  const randomSegment =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(16).slice(2, 10);

  return `${prefix}-${Date.now()}-${randomSegment}`;
}
