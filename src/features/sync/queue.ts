/**
 * Offline mutation queue stub (TRD §8). Each mutation gets a client-generated
 * op id; queue drains when online; server applies idempotently.
 */
export type MutationOp = { opId: string; kind: string; payload: unknown; createdAt: string };

const queue: MutationOp[] = [];

export function enqueueMutation(kind: string, payload: unknown): MutationOp {
  const op: MutationOp = {
    opId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    kind,
    payload,
    createdAt: new Date().toISOString(),
  };
  queue.push(op);
  return op;
}

export function pendingMutations(): MutationOp[] {
  return [...queue];
}

export function dequeueMutation(opId: string) {
  const i = queue.findIndex((o) => o.opId === opId);
  if (i >= 0) queue.splice(i, 1);
}
