import { describe, it, expect } from 'vitest';
import { LWWElementSet } from '../src/core/crdt';

describe('LWW-Element-Set CRDT', () => {
  it('should add and remove elements correctly', () => {
    const crdt = new LWWElementSet();
    crdt.add('boat-1', 100);
    expect(crdt.has('boat-1')).toBe(true);
    expect(crdt.getElements()).toEqual(['boat-1']);

    crdt.remove('boat-1', 150);
    expect(crdt.has('boat-1')).toBe(false);
    expect(crdt.getElements()).toEqual([]);
  });

  it('should handle out-of-order deliveries based on timestamps', () => {
    const crdt = new LWWElementSet();
    // Remove arrives first with later timestamp
    crdt.remove('med-kit-A', 200);
    expect(crdt.has('med-kit-A')).toBe(false);

    // Add arrives later with earlier timestamp
    crdt.add('med-kit-A', 100);
    expect(crdt.has('med-kit-A')).toBe(false);
  });

  it('should favor Add over Remove in case of timestamp ties', () => {
    const crdt = new LWWElementSet();
    const t = Date.now();
    
    crdt.remove('ration-box', t);
    crdt.add('ration-box', t);

    expect(crdt.has('ration-box')).toBe(true);
  });

  it('should merge two CRDTs idempotently and conflict-free', () => {
    const local = new LWWElementSet();
    local.add('item-1', 100);
    local.remove('item-2', 150);

    const remote = new LWWElementSet();
    remote.add('item-2', 100); // Should be ignored because local removal is 150
    remote.add('item-3', 200);

    local.merge(remote);

    expect(local.has('item-1')).toBe(true);
    expect(local.has('item-2')).toBe(false);
    expect(local.has('item-3')).toBe(true);

    // Idempotent check
    local.merge(remote);
    expect(local.has('item-3')).toBe(true);
  });
});
