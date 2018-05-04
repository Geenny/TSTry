import EventDispathcer from '../../framework/core/events/EventDispathcer';
import LauncherEvent from './events/LauncherEvent';
export default class Launcher extends EventDispathcer {
    constructor(application) {
        super();
    }
    // GET/SET
    get inited() { return this._inited; }
    get state() { return this._state; }
    set state(value) { this._state = value; }
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get application() { return this._application; }
    set application(value) { this._application = value; }
    // Init
    init() {
        this._inited = true;
        this.dispatchEvent(new LauncherEvent(LauncherEvent.INIT, this));
    }
    // Destroy
    destroy() { }
}
//# sourceMappingURL=Launcher.js.map