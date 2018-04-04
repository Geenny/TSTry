
export default class Event {

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