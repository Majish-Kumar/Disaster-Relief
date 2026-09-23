export class LWWElementSet {
  public addSet: Map<string, number>;
  public removeSet: Map<string, number>;

  constructor(
    addSet: Map<string, number> = new Map(),
    removeSet: Map<string, number> = new Map()
  ) {
    this.addSet = addSet;
    this.removeSet = removeSet;
  }

  public add(element: string, timestamp: number = Date.now()): void {
    const existing = this.addSet.get(element);
    if (existing === undefined || timestamp > existing) {
      this.addSet.set(element, timestamp);
    }
  }

  public remove(element: string, timestamp: number = Date.now()): void {
    const existing = this.removeSet.get(element);
    if (existing === undefined || timestamp > existing) {
      this.removeSet.set(element, timestamp);
    }
  }

  public has(element: string): boolean {
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

  public getElements(): string[] {
    const elements: string[] = [];
    for (const key of this.addSet.keys()) {
      if (this.has(key)) {
        elements.push(key);
      }
    }
    return elements;
  }

  public merge(remote: LWWElementSet): void {
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

  public toJSON() {
    return {
      addSet: Object.fromEntries(this.addSet),
      removeSet: Object.fromEntries(this.removeSet)
    };
  }

  public static fromJSON(data: { addSet: Record<string, number>, removeSet: Record<string, number> }): LWWElementSet {
    return new LWWElementSet(
      new Map(Object.entries(data.addSet || {})),
      new Map(Object.entries(data.removeSet || {}))
    );
  }
}
