"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LWWElementSet = void 0;
class LWWElementSet {
    addSet;
    removeSet;
    constructor(addSet = new Map(), removeSet = new Map()) {
        this.addSet = addSet;
        this.removeSet = removeSet;
    }
    add(element, timestamp = Date.now()) {
        const existing = this.addSet.get(element);
        if (existing === undefined || timestamp > existing) {
            this.addSet.set(element, timestamp);
        }
    }
    remove(element, timestamp = Date.now()) {
        const existing = this.removeSet.get(element);
        if (existing === undefined || timestamp > existing) {
            this.removeSet.set(element, timestamp);
        }
    }
    has(element) {
        const addTimestamp = this.addSet.get(element);
        const removeTimestamp = this.removeSet.get(element);
        if (addTimestamp === undefined) {
            return false;
        }
        if (removeTimestamp === undefined) {
            return true;
        }
        // Tie-breaker: If timestamps are exactly equal, bias towards 'add' 
        // to preserve resources in disaster relief context.
        return addTimestamp >= removeTimestamp;
    }
    getElements() {
        const elements = [];
        for (const key of this.addSet.keys()) {
            if (this.has(key)) {
                elements.push(key);
            }
        }
        return elements;
    }
    merge(remote) {
        for (const [element, timestamp] of remote.addSet.entries()) {
            const localTimestamp = this.addSet.get(element);
            if (localTimestamp === undefined || timestamp > localTimestamp) {
                this.addSet.set(element, timestamp);
            }
        }
        for (const [element, timestamp] of remote.removeSet.entries()) {
            const localTimestamp = this.removeSet.get(element);
            if (localTimestamp === undefined || timestamp > localTimestamp) {
                this.removeSet.set(element, timestamp);
            }
        }
    }
    toJSON() {
        return {
            addSet: Object.fromEntries(this.addSet),
            removeSet: Object.fromEntries(this.removeSet)
        };
    }
    static fromJSON(data) {
        return new LWWElementSet(new Map(Object.entries(data.addSet || {})), new Map(Object.entries(data.removeSet || {})));
    }
}
exports.LWWElementSet = LWWElementSet;
