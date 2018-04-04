import EventDispathcer from '../events/EventDispathcer';
import DependencyEvent from './events/DependencyEvent';
import DependencyManagerEvent from "./events/DependencyManagerEvent";
import Dependency from './Dependency';
export default class DependenceManager extends EventDispathcer {
    constructor(list = null) {
        super();
        this._listOfListeners = [];
        this._changeDependencyList = [];
        this._list = [];
        this.initDependencyList(list);
    }
    /**
     * INTERFACES
     */
    init() {
        if (this.started)
            return;
        this.started = true;
        this.reinit();
    }
    destroy() {
        for (let i = 0; i < this.length; i++) {
            let dependency = this._list.shift();
            if (!dependency)
                continue;
            dependency.destroy();
        }
    }
    get inited() { return this._inited; }
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    //
    // GET/SET
    //
    get length() { return this._list.length; }
    //
    // DEPENDENCY LIST
    //
    initDependencyList(list = null) {
        this.clearList();
        for (let i = 0; i < list.length; i++) {
            let dependency = list[i];
            this.dependencyAdd(dependency);
        }
    }
    clearList() {
        while (this.length) {
            let dependency = this._list.shift();
            this.dependencyDestroy(dependency);
        }
    }
    //
    // DEPENDENCY
    //
    // Уничтожение @IDependency
    dependencyDestroy(dependency) {
        if (!dependency)
            return;
        dependency.destroy();
        dependency = null;
    }
    /**
     * Добавление @IDependency в список. Метод не вернет @IDependency если
     * пере
     * @param dependency
     */
    dependencyAdd(dependency) {
        if (!(dependency instanceof Dependency))
            return null;
        if (this.dependencyInList(dependency))
            return dependency;
        this._list.push(dependency);
        if (this.inited) {
            this.dependenceChange(dependency);
        }
        return dependency;
    }
    /**
     * Удаление зависимости из списка. Метод не вернет @IDependency если
     * не удалось удалить его из списка.
     * @param dependency
     */
    dependencyRemove(dependency) {
        if (!this.dependencyInList(dependency))
            return null;
        this._list.slice(this.dependencyIndex(dependency), 1);
        return dependency;
    }
    dependencyInList(dependency) {
        return this.dependencyIndex(dependency) != -1;
    }
    // Позиция @IDependency в списке
    dependencyIndex(dependency) {
        return this._list.indexOf(dependency);
    }
    /**
     * @IDependency по позиции в списке
     * @param index
     */
    dependencyByIndexGet(index) {
        if (index < 0 || index >= this.length)
            return null;
        return this._list[index];
    }
    dependencyByIDGet(ID) {
        for (let i = 0; i < this.length; i++) {
            let dependency = this._list[i];
            if (dependency.ID == ID)
                return dependency;
        }
        return null;
    }
    /**
     * Добавление слушателей к @Dependency
     * @param dependency
     */
    dependencyListenersAdd(dependency) {
        if (this._listOfListeners.indexOf(dependency) != -1)
            return false;
        dependency.addEventListener(DependencyEvent.INIT, this.onDependencyInit);
        dependency.addEventListener(DependencyEvent.START, this.onDependencyStart);
        dependency.addEventListener(DependencyEvent.STEP, this.onDependencyStep);
        dependency.addEventListener(DependencyEvent.COMPLETE, this.onDependencyComplete);
        dependency.addEventListener(DependencyEvent.CHANGE, this.onDependencyChange);
        dependency.addEventListener(DependencyEvent.ERROR, this.onDependencyError);
        dependency.addEventListener(DependencyEvent.DESTROY, this.onDependencyDestroy);
        return true;
    }
    /**
     * Удаление пакета слушателей с @Dependency
     * @param dependency
     */
    dependencyListenersRemove(dependency) {
        if (!dependency)
            return false;
        dependency.removeEventListener(DependencyEvent.INIT, this.onDependencyInit);
        dependency.removeEventListener(DependencyEvent.START, this.onDependencyStart);
        dependency.removeEventListener(DependencyEvent.STEP, this.onDependencyStep);
        dependency.removeEventListener(DependencyEvent.COMPLETE, this.onDependencyComplete);
        dependency.removeEventListener(DependencyEvent.CHANGE, this.onDependencyChange);
        dependency.removeEventListener(DependencyEvent.ERROR, this.onDependencyError);
        dependency.removeEventListener(DependencyEvent.DESTROY, this.onDependencyDestroy);
        let index = this._listOfListeners.indexOf(dependency);
        if (index == -1)
            this._listOfListeners.splice(index, 1);
        return true;
    }
    //
    // INIT
    //
    reinit() {
        if (!this.enable)
            return;
        if (!this.started)
            return;
        this.dependenceListAddListeners();
        this.dependenceProcess();
    }
    /**
     * Подвязка слушателей к зависимостям без
     */
    dependenceListAddListeners() {
        for (let i = 0; i < this.length; i++) {
            let dependency = this.dependencyByIndexGet(i);
            if (!dependency)
                continue;
            this.dependencyListenersAdd(dependency);
        }
    }
    dependenceListRemoveListeners() {
        for (let i = 0; i < this.length; i++) {
            let dependency = this.dependencyByIndexGet(i);
            if (!dependency)
                continue;
            this.dependencyListenersRemove(dependency);
        }
    }
    //
    // DEPENDENCE PROCESS
    // Процесс подготовки каждого из модуля зависимостей
    //
    dependenceProcess() {
        this.dependencyProcessStart();
        this.dependencyProcessCheckReady();
    }
    dependencyProcessStart() {
        let listForStart = [];
        // 
        for (let i = 0; i < this.length; i++) {
            let dependency = this.dependencyByIndexGet(i);
            if (!this.isReadyForStart(dependency))
                continue;
            if (!this.childDependenciesReady(dependency))
                continue;
            listForStart.push(dependency);
        }
        // Запуск @Dependency
        for (let i = 0; i < listForStart.length; i++) {
            listForStart[i].start();
        }
    }
    dependencyProcessCheckReady() {
        if (!this.isDependencyProcessComplete)
            return false;
        this._inited = true;
        this.dispatchEvent(new DependencyManagerEvent(DependencyManagerEvent.COMPLETE, this));
        return true;
    }
    get isDependencyProcessComplete() {
        let completeCount = 0;
        for (let i = 0; i < this.length; i++) {
            let dependency = this.dependencyByIndexGet(i);
            if (dependency.complete)
                completeCount++;
        }
        return completeCount >= this.length;
    }
    /**
     * Можно ли отправить данный @Dependency на обработку
     * @param dependency
     */
    isReadyForStart(dependency) {
        return dependency && dependency.enable && !dependency.process && dependency.complete;
    }
    /**
     * Все дочерние @Dependency готовы для подготовки @dependency
     * @param dependency
     */
    childDependenciesReady(dependency) {
        let ready = false;
        let readyCount = 0;
        for (let i = 0; i < this.length; i++) {
            let target = this.dependencyByIndexGet(i);
            if (target == dependency)
                continue;
            if (target.complete)
                continue;
            if (dependency.list.indexOf(target.ID) != -1) {
                readyCount++;
            }
        }
        return readyCount >= dependency.list.length;
    }
    /**
     * Реакция на изменение какого либо @Dependency
     * @param dependency
     */
    dependenceChange(dependency) {
        if (this.dependencyInList(dependency))
            return;
        if (this.dependencyInChangeList(dependency))
            return;
        // Если не this.inited то дополнительные @Dependency собираются в отдельный
        // this._changeDependencyList для начала разинициализации родительских 
        // @Depemdency
        this._changeDependencyList.push(dependency);
        if (!this.inited)
            return;
        this.dependenceDownChange();
    }
    /**
     * Наличие данного @IDependency в списке на переинициализацию зависимостей
     * @param dependency
     */
    dependencyInChangeList(dependency) {
        return this._changeDependencyList.indexOf(dependency) != -1;
    }
    dependenceDownChange() {
        this._inited = false;
        // Дополнение this._changeDependencyList теми @IDependency из this._list
        // чтобы всем элементами this._changeDependencyList сделать переинициализацию
        while (true) {
            let addDependenciesCount = 0;
            for (let i = 0; i < this._changeDependencyList.length; i++) {
                let dependency = this._changeDependencyList[i];
                for (let j = 0; j < this._list.length; j++) {
                    let target = this._list[j];
                    if (dependency.list.indexOf(target.ID) == -1)
                        continue;
                    if (this._changeDependencyList.indexOf(target) == -1)
                        continue;
                    this._changeDependencyList.push(target);
                    addDependenciesCount++;
                }
            }
            if (addDependenciesCount == 0)
                break;
        }
        // Сброс данных @Dependency
        for (let i = 0; i < this._changeDependencyList.length; i++) {
            let dependency = this._changeDependencyList[i];
            if (!dependency)
                continue;
            if (!this.dependencyInList(dependency))
                this._list.push(dependency);
            dependency.reset();
        }
        this.dependenceProcess();
    }
    // LISTENERS HANDLERS
    onDependencyInit(event) { }
    onDependencyStart(event) { }
    onDependencyStep(event) { }
    onDependencyComplete(event) {
        let dependency = event.dependency;
        let manager = dependency.manager;
        manager.dispatchEvent(new DependencyManagerEvent(DependencyManagerEvent.DEPENDENCY_COMPLETE, manager, dependency));
        manager.dependenceProcess();
    }
    onDependencyChange(event) {
        let dependency = event.dependency;
        let manager = dependency.manager;
        manager.dispatchEvent(new DependencyManagerEvent(DependencyManagerEvent.DEPENDENCY_CHANGE, manager, dependency));
        manager.dependenceChange(dependency);
    }
    onDependencyError(event) {
        let dependency = event.dependency;
        let manager = dependency.manager;
        manager.dispatchEvent(new DependencyManagerEvent(DependencyManagerEvent.DEPENDENCY_ERROR, manager, dependency));
    }
    onDependencyDestroy(event) {
        let dependency = event.dependency;
        let manager = dependency.manager;
        manager.dispatchEvent(new DependencyManagerEvent(DependencyManagerEvent.DEPENDENCY_DESTROY, manager, dependency));
    }
}
//# sourceMappingURL=DependenceManager.js.map