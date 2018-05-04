import EventDispathcer from '../events/EventDispathcer';
import DependencyEvent from './events/DependencyEvent';
import { DependenyState } from './states/DependencyState';
export default class Dependency extends EventDispathcer {
    constructor(ID, dependencies = []) {
        super();
        this._list = [];
        this._ID = ID;
        this._list = dependencies;
    }
    //
    // GET/SET
    //
    // INTERFACE
    get inited() { return this._inited; }
    get ID() { return this._ID; }
    get name() { return this._name; }
    get description() { return this._description; }
    get state() { return this._state; }
    set state(value) { this._state = value; }
    get list() { return this._list; }
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get complete() { return this._complete; } // Инициализация завершена
    get process() { return this._process; } // Процесс инициализации
    get errorMessage() { return this._errorMessage; }
    get manager() { return this._manager; }
    set manager(value) { this._manager = value; }
    // 
    init() {
        this.dispatchEvent(new DependencyEvent(DependencyEvent.INIT, this));
    }
    destroy() {
        this.state = DependenyState.DESTROY;
        this._enable = false;
        this.dispatchEvent(new DependencyEvent(DependencyEvent.DESTROY, this));
    }
    //
    /**
     * Добавление @ID зависимостей от которых зависит данная зависимость
     * @param list
     */
    addDependency(list) {
        if (!list)
            return false;
        for (let i = 0; i < list.length; i++) {
            let id = list[i];
            let ID = (id instanceof Dependency) ? id.ID : id;
            if (this.list.indexOf(ID) != -1)
                continue;
            this.list.push(ID);
        }
        return this.list.length > 0;
    }
    // 
    /**
     * Сброс данных данного @Dependency
     */
    reset() {
        this._complete = false;
    }
    /**
     * Инициация инициализации модуля @IDependency
     */
    start() {
        this._process = true;
        this.state = DependenyState.STARTED;
        this.dispatchEvent(new DependencyEvent(DependencyEvent.START, this));
    }
    /**
     * Условный шаг процесса подготовки модуля @IDependency
     */
    step() {
        this.state = DependenyState.PROCESS;
        this.dispatchEvent(new DependencyEvent(DependencyEvent.STEP, this));
    }
    /**
     * Завершение инициализации модуля @IDependency
     */
    finish() {
        this._process = false;
        this._complete = true;
        this.state = DependenyState.COMPLETE;
        this.dispatchEvent(new DependencyEvent(DependencyEvent.COMPLETE, this));
    }
    /**
     * Ошибка модуля
     */
    error() {
        this._process = false;
        this.state = DependenyState.ERROR;
        this.dispatchEvent(new DependencyEvent(DependencyEvent.ERROR, this));
    }
    /**
     * Инициация изменений в модуле @IDependency
     */
    change() {
        this._process = true;
        this.state = DependenyState.CHANGE;
        this.dispatchEvent(new DependencyEvent(DependencyEvent.CHANGE, this));
    }
}
//# sourceMappingURL=Dependency.js.map