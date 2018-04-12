import EventDispathcer from '../events/EventDispathcer';
import KeyboardController from './keyboard/KeyboardController';
import ResizeController from './resize/ResizeController';
import FocusController from './focus/FocusController';
import OrientationController from './orientation/OrientationController';
export default class Controllers extends EventDispathcer {
    constructor(application, options = null) {
        super();
        this._list = [];
        this.controllerList = [
            KeyboardController,
            ResizeController,
            FocusController,
            OrientationController
        ];
        this.application = application;
        this.options = options;
        this.init();
    }
    // GET/SET
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get inited() { return this._inited; }
    set inited(value) { this._inited = value; }
    get application() { return this._application; }
    set application(value) { this._application = value; }
    get options() { return this._options; }
    set options(value) { this._options = value; }
    //
    init() {
        this.inited = true;
        this.addControllers(this.controllerList);
    }
    // CONTROLLERS
    addControllers(list) {
        for (let ClassName of this.controllerList) {
            let controller = new ClassName(this.application, null);
            this._list.push(controller);
        }
        // this.getOptionsForController( controllerClassName )
    }
    getOptionsForController(className) {
        return (this.options) ? this.options[className] : null;
    }
}
//# sourceMappingURL=Controllers.js.map