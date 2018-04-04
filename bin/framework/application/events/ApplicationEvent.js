import Event from '../../core/events/Event';
export default class ApplicationEvent extends Event {
    static get APPLICATION_KEYBOARD_KEYDOWN() { return "applicationKeyboardKeydown"; }
    static get APPLICATION_KEYBOARD_KEYUP() { return "applicationKeyboardKeyup"; }
    static get APPLICATION_RESIZE() { return "applicationResize"; }
    static get APPLICATION_FOCUS() { return "applicationFocus"; }
    static get APPLICATION_BLUR() { return "applicationBlur"; }
    constructor(type, data) {
        super(type, false, false);
        this.data = data;
    }
}
//# sourceMappingURL=ApplicationEvent.js.map