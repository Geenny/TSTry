import EventDispathcer from '../core/events/EventDispathcer';
import Modules from './modules/Modules';
import Controllers from '../core/controllers/Controllers';
export default class Application extends EventDispathcer {
    constructor(container) {
        super();
        this.controllerOptions = null;
        Application.application = this;
        this.initContainer(container);
    }
    //
    // GET/SET
    //
    get inited() { return this._inited; }
    get started() { return this._started; }
    set started(value) { this._started = value; }
    get container() { return this._container; }
    // INIT
    initContainer(container) {
        this._container = container;
    }
    init() {
        this.modules = new Modules();
        this.controllers = new Controllers(this, this.controllerOptions);
    }
}
//# sourceMappingURL=Application.js.map