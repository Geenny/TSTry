import Event from '../../core/events/Event';
export default class ApplicationEvent extends Event {
    static get APPLICATION_KEYBOARD_KEYDOWN() { return "applicationKeyboardKeydown"; }
    static get APPLICATION_KEYBOARD_KEYUP() { return "applicationKeyboardKeyup"; }
    static get APPLICATION_RESIZE() { return "applicationResize"; }
    static get APPLICATION_FOCUS() { return "applicationFocus"; }
    static get APPLICATION_BLUR() { return "applicationBlur"; }
    static get APPLICATION_SCREEN_FULL() { return "applicationScreenFull"; }
    static get APPLICATION_SCREEN_NORMAL() { return "applicationScreenNormal"; }
    static get APPLICATION_SERVICE_STORAGE_STORE() { return "applicationServiceStorageStore"; }
    static get APPLICATION_SERVICE_STORAGE_READ() { return "applicationServiceStorageRead"; }
    static get APPLICATION_DEVICE_ORIENTATION_CHANGE() { return "applicationDeviceOrientationChange"; }
    static get APPLICATION_DEVICE_ORIENTATION() { return "applicationDeviceOrientation"; }
    static get APPLICATION_DEVICE_MOTION() { return "applicationDeviceMotion"; }
    constructor(type, data) {
        super(type, false, false);
        this.data = data;
    }
}
//# sourceMappingURL=ApplicationEvent.js.map