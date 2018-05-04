import EventDispathcer from '../framework/core/events/EventDispathcer';
import UserVO from './vo/UserVO';
import UserDependency from './UserDependency';
import { ApplicationDependencyConst } from '../core/dependency/ApplicationDependencyConst';
import DependencyEvent from '../framework/core/dependency/events/DependencyManagerEvent';
import Application from '../framework/application/Application';
import Main from '../Main';
export default class User extends EventDispathcer {
    constructor(userVO = new UserVO()) {
        super();
        this.initVO(userVO);
    }
    // GET/SET
    get inited() { return this._inited; }
    get state() { return this._state; }
    set state(value) { this._state = value; }
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get dependency() { return this._dependency; }
    set dependency(value) { this._dependency = value; }
    get vo() { return this._vo; }
    get profile() { return this.vo.profile; }
    get application() { return Application.instance; }
    // VO
    initVO(vo) {
        this._vo = vo;
    }
    // INIT
    init() {
        if (this.inited)
            return;
        this.initDependency();
        this._inited = true;
    }
    //
    // DEPENDENCY
    //
    /**
     * Создание зависимости для @User
     */
    initDependency() {
        let dependency = new UserDependency(ApplicationDependencyConst.USER, []);
        this._dependency = dependency;
        dependency.manager = Main.instance.applicationDependenceManager;
        dependency.addEventListener(DependencyEvent.DEPENDENCY_COMPLETE, this.onDependencyComplete, false, 1);
        dependency.addEventListener(DependencyEvent.DEPENDENCY_CHANGE, this.onDependencyChange, false, 1);
    }
    onDependencyComplete(event) {
    }
    onDependencyChange(event) {
    }
}
//# sourceMappingURL=User.js.map