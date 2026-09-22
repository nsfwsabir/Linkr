import { enqueueMutation, pendingMutations, dequeueMutation, drainMutations } from './queue';

describe('sync queue', () => {
  test('enqueues with client-generated op id and dequeues', () => {
    const op = enqueueMutation('create-link', { url: 'https://example.com' });
    expect(op.opId).toBeTruthy();
    expect(pendingMutations().some((o) => o.opId === op.opId)).toBe(true);
    dequeueMutation(op.opId);
    expect(pendingMutations().some((o) => o.opId === op.opId)).toBe(false);
  });

  test('drains in order and stops on first failure', async () => {
    const a = enqueueMutation('create-link', { url: 'https://a.example' });
    const b = enqueueMutation('delete-link', { id: 'x' });
    const seen: string[] = [];
    const drained = await drainMutations(async (op) => {
      seen.push(op.kind);
      if (op.kind === 'delete-link') throw new Error('offline');
    });
    expect(drained).toBe(1);
    expect(seen).toEqual(['create-link', 'delete-link']);
    expect(pendingMutations().some((o) => o.opId === a.opId)).toBe(false);
    expect(pendingMutations().some((o) => o.opId === b.opId)).toBe(true);
    dequeueMutation(b.opId);
  });
});
