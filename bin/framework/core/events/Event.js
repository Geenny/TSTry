export default class Event {
    static get ANY() { return "any"; }
    constructor(type, bubbles = false, cancelable = false) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
    }
}
//# sourceMappingURL=Event.js.map