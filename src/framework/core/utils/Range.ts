
export default class Range {

    private _start: number = 0;
    private _finish: number = 0;

    constructor( start: number = 0, finish: number = Number.MAX_SAFE_INTEGER ) {
        this.start = start;
        this.finish = finish;
    }

    public get start(): number { return this._start; }
    public set start( value: number ) { this._start = value; }

    public get finish(): number { return this._finish; }
    public set finish( value: number ) { this._finish = value; }

    public get size(): number { return this._finish - this._start; }

    public reset() {
        this.start = 0;
        this.finish = Number.MAX_SAFE_INTEGER;
    }

}

