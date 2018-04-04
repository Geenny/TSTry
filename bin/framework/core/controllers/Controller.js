import EventDispathcer from '../events/EventDispathcer';
export default class Controller extends EventDispathcer {
    constructor(application, options = null) {
        super();
        this._enable = true;
        this.options = {};
        this.initApplication(application);
        this.initOptions(options);
    }
    initApplication(application) {
        if (!application)
            return;
        this.application = application;
    }
    initOptions(options) {
        if (!options)
            return;
        this.options = options;
    }
    init() {
    }
    // GET/SET
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get inited() { return this._inited; }
    set inited(value) { this._inited = value; }
    get application() { return this._application; }
    set application(value) { this._application = value; }
    get target() { return this._target; }
    set target(value) { this._target = value; }
}
//# sourceMappingURL=Controller.js.map