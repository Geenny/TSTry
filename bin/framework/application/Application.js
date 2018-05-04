import EventDispathcer from '../core/events/EventDispathcer';
import Modules from './modules/Modules';
import Controllers from '../core/controllers/Controllers';
import ApplicationEvent from './events/ApplicationEvent';
export default class Application extends EventDispathcer {
    constructor(container) {
        super();
        this.controllerOptions = null;
        Application.instance = this;
        this.initContainer(container);
    }
    //
    // GET/SET
    //
    get inited() { return this._inited; }
    get started() { return this._started; }
    set started(value) { this._started = value; }
    get container() { return this._container; }
    get pause() { return this._pause; }
    set pause(value) {
        if (this._pause == value)
            return;
        this._pause = value;
        this.setPause();
        this.dispatchEvent(new ApplicationEvent(ApplicationEvent.APPLICATION_PAUSE, null));
    }
    // INIT
    initContainer(container) {
        this._container = container;
    }
    init() {
        this.modules = new Modules();
        this.controllers = new Controllers(this, this.controllerOptions);
        this._inited = true;
    }
    //
    // MODULES
    // 
    //
    // TECH
    //
    /**
     * Установка паузы
     */
    setPause() {
        this.modules.enable = !this._pause;
        this.controllers.enable = !this._pause;
    }
}
//# sourceMappingURL=Application.js.map