export type SaveStatus = "idle" | "saving" | "saved";

let status: SaveStatus = "idle";
const listeners = new Set<() => void>();
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  listeners.forEach((l) => l());
}

export function getSaveStatus(): SaveStatus {
  return status;
}

export function subscribeSaveStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function markSaving() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  status = "saving";
  emit();
}

export function markSaved() {
  status = "saved";
  emit();
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    status = "idle";
    hideTimer = null;
    emit();
  }, 2500);
}
