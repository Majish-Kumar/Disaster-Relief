"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const crdt_1 = require("../src/core/crdt");
(0, vitest_1.describe)('LWW-Element-Set CRDT', () => {
    (0, vitest_1.it)('should add and remove elements correctly', () => {
        const crdt = new crdt_1.LWWElementSet();
        crdt.add('boat-1', 100);
        (0, vitest_1.expect)(crdt.has('boat-1')).toBe(true);
        (0, vitest_1.expect)(crdt.getElements()).toEqual(['boat-1']);
        crdt.remove('boat-1', 150);
        (0, vitest_1.expect)(crdt.has('boat-1')).toBe(false);
        (0, vitest_1.expect)(crdt.getElements()).toEqual([]);
    });
    (0, vitest_1.it)('should handle out-of-order deliveries based on timestamps', () => {
        const crdt = new crdt_1.LWWElementSet();
        // Remove arrives first with later timestamp
        crdt.remove('med-kit-A', 200);
        (0, vitest_1.expect)(crdt.has('med-kit-A')).toBe(false);
        // Add arrives later with earlier timestamp
        crdt.add('med-kit-A', 100);
        (0, vitest_1.expect)(crdt.has('med-kit-A')).toBe(false);
    });
    (0, vitest_1.it)('should favor Add over Remove in case of timestamp ties', () => {
        const crdt = new crdt_1.LWWElementSet();
        const t = Date.now();
        crdt.remove('ration-box', t);
        crdt.add('ration-box', t);
        (0, vitest_1.expect)(crdt.has('ration-box')).toBe(true);
    });
    (0, vitest_1.it)('should merge two CRDTs idempotently and conflict-free', () => {
        const local = new crdt_1.LWWElementSet();
        local.add('item-1', 100);
        local.remove('item-2', 150);
        const remote = new crdt_1.LWWElementSet();
        remote.add('item-2', 100); // Should be ignored because local removal is 150
        remote.add('item-3', 200);
        local.merge(remote);
        (0, vitest_1.expect)(local.has('item-1')).toBe(true);
        (0, vitest_1.expect)(local.has('item-2')).toBe(false);
        (0, vitest_1.expect)(local.has('item-3')).toBe(true);
        // Idempotent check
        local.merge(remote);
        (0, vitest_1.expect)(local.has('item-3')).toBe(true);
    });
});
