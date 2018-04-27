import Event from '../../core/events/Event';
import Application from '../Application';

export default class ApplicationEvent extends Event {

    public static get APPLICATION_KEYBOARD_KEYDOWN(): string { return "applicationKeyboardKeydown"; }
    public static get APPLICATION_KEYBOARD_KEYUP(): string { return "applicationKeyboardKeyup"; }

    public static get APPLICATION_RESIZE(): string { return "applicationResize"; }

    public static get APPLICATION_FOCUS(): string { return "applicationFocus"; }
    public static get APPLICATION_BLUR(): string { return "applicationBlur"; }

    public static get APPLICATION_SCREEN_FULL(): string { return "applicationScreenFull"; }
    public static get APPLICATION_SCREEN_NORMAL(): string { return "applicationScreenNormal"; }

    public static get APPLICATION_SERVICE_STORAGE_STORE(): string { return "applicationServiceStorageStore"; }
    public static get APPLICATION_SERVICE_STORAGE_READ(): string { return "applicationServiceStorageRead"; }

    public static get APPLICATION_DEVICE_ORIENTATION_CHANGE(): string { return "applicationDeviceOrientationChange"; }
    public static get APPLICATION_DEVICE_ORIENTATION(): string { return "applicationDeviceOrientation"; }
    public static get APPLICATION_DEVICE_MOTION(): string { return "applicationDeviceMotion"; }

    public static get APPLICATION_PAUSE(): string { return "applicationPause"; }

    public data: IVO;

    constructor( type: string, data: IVO ) {
        super( type, false, false );
        this.data = data;
    }

}