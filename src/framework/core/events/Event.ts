
export default class Event {

    public static get ANY(): string { return "any"; }

    public type: string;
    public bubbles: boolean;
    public cancelable: boolean;
    public callback: Function;

    constructor( type: string, bubbles: boolean = false, cancelable: boolean = false ) {

        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;

    }

}