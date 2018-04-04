import EventDispathcer from '../../core/events/EventDispathcer';
import DependenceManager from '../../core/dependency/DependenceManager';
import DependencyManagerEvent from '../../core/dependency/events/DependencyManagerEvent';
import ModuleEvent from './events/ModuleEvent';
import ModulesEvent from './events/ModulesEvent';
export default class Modules extends EventDispathcer {
    constructor() {
        super();
        this._enable = true;
        this.dependencyListByNames = []; // Список имен
    }
    //
    init() {
        this.initDependencyManager();
    }
    destroy() { }
    // GET/SET
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    // DEPENDENCIES
    initDependencyManager() {
        this.manager = new DependenceManager(this.getModules());
        this.addEventListener(DependencyManagerEvent.DEPENDENCY_CHANGE, this.onModuleChange);
        this.addEventListener(DependencyManagerEvent.DEPENDENCY_COMPLETE, this.onModuleComplete);
        this.addEventListener(DependencyManagerEvent.DEPENDENCY_DESTROY, this.onModuleDestroy);
        this.addEventListener(DependencyManagerEvent.DEPENDENCY_ERROR, this.onModuleError);
        this.addEventListener(DependencyManagerEvent.INIT, this.onModulesInit);
        this.addEventListener(DependencyManagerEvent.COMPLETE, this.onModulesComplete);
        this.manager.init();
    }
    onModuleChange(event) {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.CHANGE, event.dependency));
    }
    onModuleComplete(event) {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.COMPLETE, event.dependency));
    }
    onModuleDestroy(event) {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.DESTROY, event.dependency));
    }
    onModuleError(event) {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.ERROR, event.dependency));
    }
    onModulesInit(event) {
        this.dispatchEvent(new ModulesEvent(ModulesEvent.INIT, this, event.dependency));
    }
    onModulesComplete(event) {
        this.dispatchEvent(new ModulesEvent(ModulesEvent.COMPLETE, this, event.dependency));
    }
    /**
     * Список
     */
    getModules() {
        let list = [];
        for (let i = 0; i < this.dependencyListByNames.length; i++) {
            let dependency = this.getDependencyByName(this.dependencyListByNames[i]);
            if (!dependency)
                continue;
            list.push(dependency);
        }
        return list;
    }
    /**
     * Метод для возврата @Module по его имени
     * @param name
     */
    getDependencyByName(name) { return null; }
}
//# sourceMappingURL=Modules.js.map