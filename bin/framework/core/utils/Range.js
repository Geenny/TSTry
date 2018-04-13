export default class Range {
    constructor(start = 0, finish = Number.MAX_SAFE_INTEGER) {
        this._start = 0;
        this._finish = 0;
        this.start = start;
        this.finish = finish;
    }
    get start() { return this._start; }
    set start(value) { this._start = value; }
    get finish() { return this._finish; }
    set finish(value) { this._finish = value; }
    get size() { return this._finish - this._start; }
    reset() {
        this.start = 0;
        this.finish = Number.MAX_SAFE_INTEGER;
    }
}
//# sourceMappingURL=Range.js.map