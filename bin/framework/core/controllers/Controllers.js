import EventDispathcer from '../events/EventDispathcer';
import ControllersVO from './ControllersVO';
export default class Controllers extends EventDispathcer {
    constructor(application, controllersVO = null) {
        super();
        this._list = [];
        this.application = application;
        this.initControllersVO(controllersVO);
        this.init();
    }
    // GET/SET
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get inited() { return this._inited; }
    set inited(value) { this._inited = value; }
    get application() { return this._application; }
    set application(value) { this._application = value; }
    get vo() { return this._vo; }
    get controllerList() { return this.vo.controllerList; }
    //
    init() {
        this.inited = true;
        this.addControllers(this.controllerList);
    }
    initControllersVO(controllersVO) {
        this._vo = (controllersVO) ? controllersVO : new ControllersVO();
    }
    // CONTROLLERS
    /**
     * Добавление всех контроллеров по списку
     * @param list
     */
    addControllers(list) {
        for (let ClassName of this.controllerList) {
            let controller = new ClassName(this.application, this.getOptionsForController(ClassName.name));
            this._list.push(controller);
        }
    }
    getOptionsForController(className) {
        return (this.vo[className]) ? this.vo[className] : this.vo.data[className];
    }
}
//# sourceMappingURL=Controllers.js.map