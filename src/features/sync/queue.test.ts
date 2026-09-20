import { enqueueMutation, pendingMutations, dequeueMutation } from './queue';

describe('sync queue', () => {
  test('enqueues with client-generated op id and dequeues', () => {
    const op = enqueueMutation('create-link', { url: 'https://example.com' });
    expect(op.opId).toBeTruthy();
    expect(pendingMutations().some((o) => o.opId === op.opId)).toBe(true);
    dequeueMutation(op.opId);
    expect(pendingMutations().some((o) => o.opId === op.opId)).toBe(false);
  });
});
