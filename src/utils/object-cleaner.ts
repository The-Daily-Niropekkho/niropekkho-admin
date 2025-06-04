/* eslint-disable @typescript-eslint/no-explicit-any */
export class ObjectCleaner {
    private target: { [key: string]: any };

    constructor(target: { [key: string]: any }) {
        this.target = target;
    }

    /**
     * Public entry point to start cleaning the target object.
     * After calling this, `target` no longer contains null, undefined, empty-string,
     * empty objects, or empty arrays.
     */
    public clean(): void {
        this._cleanObject(this.target);
    }

    /**
     * Returns the cleaned object, for convenience.
     * (Useful if you want to chain or inspect the result.)
     */
    public getResult(): { [key: string]: any } {
        return this.target;
    }

    /**
     * Recursively remove null, undefined, empty-string, empty-array, and empty-object values.
     */
    private _cleanObject(obj: { [key: string]: any }): void {
        for (const key in obj) {
            const value = obj[key];

            // If value is falsey, decide what to do
            if (!Boolean(value)) {
                // 1. If it's exactly null, undefined, or empty string → delete
                if (value === null || value === undefined) {
                    delete obj[key];
                    continue;
                }

                // 2. If it's an array → filter out null/undefined, then possibly delete if empty
                if (Array.isArray(value)) {
                    obj[key] = value.filter(
                        (item: any) => item !== null && item !== undefined
                    );

                    if (obj[key].length === 0) {
                        delete obj[key];
                    }
                    continue;
                }

                // 3. If it's an object (but not array) → recurse, then possibly delete if empty
                if (typeof value === "object") {
                    this._cleanObject(value);

                    if (Object.keys(value).length === 0) {
                        delete obj[key];
                    }
                    continue;
                }
            }
            // If value is truthy, but still an object or array, we need to recurse inside
            else {
                if (Array.isArray(value)) {
                    // Recursively clean objects inside arrays
                    for (let i = 0; i < value.length; i++) {
                        if (typeof value[i] === "object" && value[i] !== null) {
                            this._cleanObject(value[i]);
                        }
                    }
                    // After cleaning items, also filter out now-empty objects if needed
                    obj[key] = value.filter((item: any) => {
                        if (item === null || item === undefined) return false;
                        if (typeof item === "object" && !Array.isArray(item)) {
                            return Object.keys(item).length > 0;
                        }
                        return true;
                    });

                    if (obj[key].length === 0) {
                        delete obj[key];
                    }
                } else if (typeof value === "object") {
                    this._cleanObject(value);
                    if (Object.keys(value).length === 0) {
                        delete obj[key];
                    }
                }
            }
        }
    }
}
