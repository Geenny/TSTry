System.register("framework/core/events/Event", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Event;
    return {
        setters: [],
        execute: function () {
            Event = class Event {
                constructor(type, bubbles = false, cancelable = false) {
                    this.type = type;
                    this.bubbles = bubbles;
                    this.cancelable = cancelable;
                }
            };
            exports_1("default", Event);
        }
    };
});
System.register("framework/core/events/EventDispathcer", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var EventDispathcer, EventVO;
    return {
        setters: [],
        execute: function () {
            EventDispathcer = class EventDispathcer {
                constructor() {
                    this._dispatcher = [];
                }
                dispatchEvent(event) {
                    for (let i = 0; i < this._dispatcher.length; i++) {
                        let target = this._dispatcher[i];
                        if (target.type != event.type)
                            continue;
                        target.handler();
                    }
                }
                addEventListener(type, handler, useCapture = false, priority = 0) {
                    if (!type || !handler)
                        return;
                    this._dispatcher.push(new EventVO(type, handler, useCapture, priority));
                }
                /**
                 * Очистка слушателя
                 * @param type
                 * @param handler
                 */
                removeEventListener(type, handler) {
                    for (let i = this._dispatcher.length - 1; i > -1; i--) {
                        let target = this._dispatcher[i];
                        if (target.type != type && target.handler != handler)
                            continue;
                        this._dispatcher.splice(i, 1);
                    }
                }
                /**
                 * Очистка всех слушателей
                 */
                removeEventListeners() {
                    while (this._dispatcher.length) {
                        let target = this._dispatcher[this._dispatcher.length - 1];
                        this.removeEventListener(target.type, target.handler);
                    }
                }
            };
            exports_2("default", EventDispathcer);
            EventVO = class EventVO {
                constructor(type, handler, useCapture = false, priority = 0) {
                    this.type = type;
                    this.handler = handler;
                    this.useCapture = useCapture;
                    this.priority = priority;
                }
            };
        }
    };
});
System.register("framework/core/dependency/events/DependencyEvent", ["framework/core/events/Event"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Event_1, DependencyEvent;
    return {
        setters: [
            function (Event_1_1) {
                Event_1 = Event_1_1;
            }
        ],
        execute: function () {
            DependencyEvent = class DependencyEvent extends Event_1.default {
                static get INIT() { return "dependencyInit"; }
                static get START() { return "dependencyStart"; }
                static get COMPLETE() { return "dependencyComplete"; }
                static get CHANGE() { return "dependencyChange"; }
                static get STEP() { return "dependencyStep"; }
                static get ERROR() { return "dependencyError"; }
                static get DESTROY() { return "dependencyError"; }
                constructor(type, dependency) {
                    super(type, false, false);
                    this.dependency = dependency;
                }
            };
            exports_3("default", DependencyEvent);
        }
    };
});
System.register("framework/core/dependency/events/DependencyManagerEvent", ["framework/core/events/Event"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Event_2, DependencyEvent;
    return {
        setters: [
            function (Event_2_1) {
                Event_2 = Event_2_1;
            }
        ],
        execute: function () {
            DependencyEvent = class DependencyEvent extends Event_2.default {
                static get INIT() { return "dependencyManagerInit"; }
                static get COMPLETE() { return "dependencyManagerComplete"; }
                static get DEPENDENCY_COMPLETE() { return "dependencyManagerDependencyComplete"; }
                static get DEPENDENCY_CHANGE() { return "dependencyManagerDependencyChange"; }
                static get DEPENDENCY_ERROR() { return "dependencyManagerDependencyError"; }
                static get DEPENDENCY_DESTROY() { return "dependencyManagerDependencyDestroy"; }
                constructor(type, manager = null, dependency = null) {
                    super(type, false, false);
                    this.manager = manager;
                    this.dependency = dependency;
                }
            };
            exports_4("default", DependencyEvent);
        }
    };
});
System.register("framework/core/dependency/states/DependencyState", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var DependenyState;
    return {
        setters: [],
        execute: function () {
            (function (DependenyState) {
                DependenyState[DependenyState["NONE"] = 0] = "NONE";
                DependenyState[DependenyState["STARTED"] = 1] = "STARTED";
                DependenyState[DependenyState["PROCESS"] = 2] = "PROCESS";
                DependenyState[DependenyState["COMPLETE"] = 3] = "COMPLETE";
                DependenyState[DependenyState["CHANGE"] = 4] = "CHANGE";
                DependenyState[DependenyState["DESTROY"] = 5] = "DESTROY";
                DependenyState[DependenyState["ERROR"] = 6] = "ERROR";
            })(DependenyState || (DependenyState = {}));
            exports_5("DependenyState", DependenyState);
        }
    };
});
System.register("framework/core/dependency/Dependency", ["framework/core/events/EventDispathcer", "framework/core/dependency/events/DependencyEvent", "framework/core/dependency/states/DependencyState"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var EventDispathcer_1, DependencyEvent_1, DependencyState_1, Dependency;
    return {
        setters: [
            function (EventDispathcer_1_1) {
                EventDispathcer_1 = EventDispathcer_1_1;
            },
            function (DependencyEvent_1_1) {
                DependencyEvent_1 = DependencyEvent_1_1;
            },
            function (DependencyState_1_1) {
                DependencyState_1 = DependencyState_1_1;
            }
        ],
        execute: function () {
            Dependency = class Dependency extends EventDispathcer_1.default {
                constructor(manager, dependencies = []) {
                    super();
                    this._list = [];
                    this._manager = manager;
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
                // 
                init() {
                    this.dispatchEvent(new DependencyEvent_1.default(DependencyEvent_1.default.INIT, this));
                }
                destroy() {
                    this.state = DependencyState_1.DependenyState.DESTROY;
                    this._enable = false;
                    this.dispatchEvent(new DependencyEvent_1.default(DependencyEvent_1.default.DESTROY, this));
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
                    this.state = DependencyState_1.DependenyState.STARTED;
                    this.dispatchEvent(new DependencyEvent_1.default(DependencyEvent_1.default.START, this));
                }
                /**
                 * Условный шаг процесса подготовки модуля @IDependency
                 */
                step() {
                    this.state = DependencyState_1.DependenyState.PROCESS;
                    this.dispatchEvent(new DependencyEvent_1.default(DependencyEvent_1.default.STEP, this));
                }
                /**
                 * Завершение инициализации модуля @IDependency
                 */
                finish() {
                    this._process = false;
                    this._complete = true;
                    this.state = DependencyState_1.DependenyState.COMPLETE;
                    this.dispatchEvent(new DependencyEvent_1.default(DependencyEvent_1.default.COMPLETE, this));
                }
                /**
                 * Ошибка модуля
                 */
                error() {
                    this._process = false;
                    this.state = DependencyState_1.DependenyState.ERROR;
                    this.dispatchEvent(new DependencyEvent_1.default(DependencyEvent_1.default.ERROR, this));
                }
                /**
                 * Инициация изменений в модуле @IDependency
                 */
                change() {
                    this._process = true;
                    this.state = DependencyState_1.DependenyState.CHANGE;
                    this.dispatchEvent(new DependencyEvent_1.default(DependencyEvent_1.default.CHANGE, this));
                }
            };
            exports_6("default", Dependency);
        }
    };
});
System.register("framework/core/dependency/DependenceManager", ["framework/core/events/EventDispathcer", "framework/core/dependency/events/DependencyEvent", "framework/core/dependency/events/DependencyManagerEvent", "framework/core/dependency/Dependency"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var EventDispathcer_2, DependencyEvent_2, DependencyManagerEvent_1, Dependency_1, DependenceManager;
    return {
        setters: [
            function (EventDispathcer_2_1) {
                EventDispathcer_2 = EventDispathcer_2_1;
            },
            function (DependencyEvent_2_1) {
                DependencyEvent_2 = DependencyEvent_2_1;
            },
            function (DependencyManagerEvent_1_1) {
                DependencyManagerEvent_1 = DependencyManagerEvent_1_1;
            },
            function (Dependency_1_1) {
                Dependency_1 = Dependency_1_1;
            }
        ],
        execute: function () {
            DependenceManager = class DependenceManager extends EventDispathcer_2.default {
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
                    if (!(dependency instanceof Dependency_1.default))
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
                    dependency.addEventListener(DependencyEvent_2.default.INIT, this.onDependencyInit);
                    dependency.addEventListener(DependencyEvent_2.default.START, this.onDependencyStart);
                    dependency.addEventListener(DependencyEvent_2.default.STEP, this.onDependencyStep);
                    dependency.addEventListener(DependencyEvent_2.default.COMPLETE, this.onDependencyComplete);
                    dependency.addEventListener(DependencyEvent_2.default.CHANGE, this.onDependencyChange);
                    dependency.addEventListener(DependencyEvent_2.default.ERROR, this.onDependencyError);
                    dependency.addEventListener(DependencyEvent_2.default.DESTROY, this.onDependencyDestroy);
                    return true;
                }
                /**
                 * Удаление пакета слушателей с @Dependency
                 * @param dependency
                 */
                dependencyListenersRemove(dependency) {
                    if (!dependency)
                        return false;
                    dependency.removeEventListener(DependencyEvent_2.default.INIT, this.onDependencyInit);
                    dependency.removeEventListener(DependencyEvent_2.default.START, this.onDependencyStart);
                    dependency.removeEventListener(DependencyEvent_2.default.STEP, this.onDependencyStep);
                    dependency.removeEventListener(DependencyEvent_2.default.COMPLETE, this.onDependencyComplete);
                    dependency.removeEventListener(DependencyEvent_2.default.CHANGE, this.onDependencyChange);
                    dependency.removeEventListener(DependencyEvent_2.default.ERROR, this.onDependencyError);
                    dependency.removeEventListener(DependencyEvent_2.default.DESTROY, this.onDependencyDestroy);
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
                    this.dispatchEvent(new DependencyManagerEvent_1.default(DependencyManagerEvent_1.default.COMPLETE, this));
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
                    manager.dispatchEvent(new DependencyManagerEvent_1.default(DependencyManagerEvent_1.default.DEPENDENCY_COMPLETE, manager, dependency));
                    manager.dependenceProcess();
                }
                onDependencyChange(event) {
                    let dependency = event.dependency;
                    let manager = dependency.manager;
                    manager.dispatchEvent(new DependencyManagerEvent_1.default(DependencyManagerEvent_1.default.DEPENDENCY_CHANGE, manager, dependency));
                    manager.dependenceChange(dependency);
                }
                onDependencyError(event) {
                    let dependency = event.dependency;
                    let manager = dependency.manager;
                    manager.dispatchEvent(new DependencyManagerEvent_1.default(DependencyManagerEvent_1.default.DEPENDENCY_ERROR, manager, dependency));
                }
                onDependencyDestroy(event) {
                    let dependency = event.dependency;
                    let manager = dependency.manager;
                    manager.dispatchEvent(new DependencyManagerEvent_1.default(DependencyManagerEvent_1.default.DEPENDENCY_DESTROY, manager, dependency));
                }
            };
            exports_7("default", DependenceManager);
        }
    };
});
System.register("framework/application/modules/Module", ["framework/core/dependency/Dependency"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Dependency_2, Module;
    return {
        setters: [
            function (Dependency_2_1) {
                Dependency_2 = Dependency_2_1;
            }
        ],
        execute: function () {
            Module = class Module extends Dependency_2.default {
                constructor(manager, dependencies = []) {
                    super(manager, dependencies);
                    this.options = {};
                }
            };
            exports_8("default", Module);
        }
    };
});
System.register("framework/application/modules/events/ModuleEvent", ["framework/core/events/Event"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var Event_3, ModuleEvent;
    return {
        setters: [
            function (Event_3_1) {
                Event_3 = Event_3_1;
            }
        ],
        execute: function () {
            ModuleEvent = class ModuleEvent extends Event_3.default {
                static get ERROR() { return "moduleError"; }
                static get DESTROY() { return "moduleDestroy"; }
                static get COMPLETE() { return "moduleComplete"; }
                static get CHANGE() { return "moduleChange"; }
                constructor(type, module) {
                    super(type, false, false);
                    this.module = module;
                }
            };
            exports_9("default", ModuleEvent);
        }
    };
});
System.register("framework/application/modules/events/ModulesEvent", ["framework/core/events/Event"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var Event_4, ModuleEvent;
    return {
        setters: [
            function (Event_4_1) {
                Event_4 = Event_4_1;
            }
        ],
        execute: function () {
            ModuleEvent = class ModuleEvent extends Event_4.default {
                static get INIT() { return "modulesInit"; }
                static get COMPLETE() { return "modulesComplete"; }
                constructor(type, modules, module = null) {
                    super(type, false, false);
                    this.modules = modules;
                    this.module = module;
                }
            };
            exports_10("default", ModuleEvent);
        }
    };
});
System.register("framework/application/modules/Modules", ["framework/core/events/EventDispathcer", "framework/core/dependency/DependenceManager", "framework/core/dependency/events/DependencyManagerEvent", "framework/application/modules/events/ModuleEvent", "framework/application/modules/events/ModulesEvent"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var EventDispathcer_3, DependenceManager_1, DependencyManagerEvent_2, ModuleEvent_1, ModulesEvent_1, Modules;
    return {
        setters: [
            function (EventDispathcer_3_1) {
                EventDispathcer_3 = EventDispathcer_3_1;
            },
            function (DependenceManager_1_1) {
                DependenceManager_1 = DependenceManager_1_1;
            },
            function (DependencyManagerEvent_2_1) {
                DependencyManagerEvent_2 = DependencyManagerEvent_2_1;
            },
            function (ModuleEvent_1_1) {
                ModuleEvent_1 = ModuleEvent_1_1;
            },
            function (ModulesEvent_1_1) {
                ModulesEvent_1 = ModulesEvent_1_1;
            }
        ],
        execute: function () {
            Modules = class Modules extends EventDispathcer_3.default {
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
                    this.manager = new DependenceManager_1.default(this.getModules());
                    this.addEventListener(DependencyManagerEvent_2.default.DEPENDENCY_CHANGE, this.onModuleChange);
                    this.addEventListener(DependencyManagerEvent_2.default.DEPENDENCY_COMPLETE, this.onModuleComplete);
                    this.addEventListener(DependencyManagerEvent_2.default.DEPENDENCY_DESTROY, this.onModuleDestroy);
                    this.addEventListener(DependencyManagerEvent_2.default.DEPENDENCY_ERROR, this.onModuleError);
                    this.addEventListener(DependencyManagerEvent_2.default.INIT, this.onModulesInit);
                    this.addEventListener(DependencyManagerEvent_2.default.COMPLETE, this.onModulesComplete);
                    this.manager.init();
                }
                onModuleChange(event) {
                    this.dispatchEvent(new ModuleEvent_1.default(ModuleEvent_1.default.CHANGE, event.dependency));
                }
                onModuleComplete(event) {
                    this.dispatchEvent(new ModuleEvent_1.default(ModuleEvent_1.default.COMPLETE, event.dependency));
                }
                onModuleDestroy(event) {
                    this.dispatchEvent(new ModuleEvent_1.default(ModuleEvent_1.default.DESTROY, event.dependency));
                }
                onModuleError(event) {
                    this.dispatchEvent(new ModuleEvent_1.default(ModuleEvent_1.default.ERROR, event.dependency));
                }
                onModulesInit(event) {
                    this.dispatchEvent(new ModulesEvent_1.default(ModulesEvent_1.default.INIT, this, event.dependency));
                }
                onModulesComplete(event) {
                    this.dispatchEvent(new ModulesEvent_1.default(ModulesEvent_1.default.COMPLETE, this, event.dependency));
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
            };
            exports_11("default", Modules);
        }
    };
});
System.register("framework/core/utils/Log", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var Log;
    return {
        setters: [],
        execute: function () {
            Log = class Log {
                constructor() { }
                static log(...args) {
                    console.log(args);
                }
            };
            exports_12("default", Log);
        }
    };
});
System.register("framework/core/controllers/keyboard/KeyboardController", ["framework/core/utils/Log"], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var Log_1, KeyboardController;
    return {
        setters: [
            function (Log_1_1) {
                Log_1 = Log_1_1;
            }
        ],
        execute: function () {
            KeyboardController = class KeyboardController {
                static get KEYDOWN() { return "keydown"; }
                static get KEYUP() { return "keyup"; }
                constructor(application) {
                    this.application = application;
                    this.init();
                }
                // GET/SET
                get container() { return this.application.container; }
                //
                init() {
                    this.container.addEventListener(KeyboardController.KEYDOWN, this.onKeyDown);
                    this.container.addEventListener(KeyboardController.KEYDOWN, this.onKeyUp);
                }
                onKeyDown(event) {
                    Log_1.default.log(event);
                }
                onKeyUp(event) {
                    Log_1.default.log(event);
                }
            };
            exports_13("default", KeyboardController);
        }
    };
});
System.register("framework/application/Application", ["framework/core/events/EventDispathcer", "framework/application/modules/Modules", "framework/core/controllers/keyboard/KeyboardController"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var EventDispathcer_4, Modules_1, KeyboardController_1, Application;
    return {
        setters: [
            function (EventDispathcer_4_1) {
                EventDispathcer_4 = EventDispathcer_4_1;
            },
            function (Modules_1_1) {
                Modules_1 = Modules_1_1;
            },
            function (KeyboardController_1_1) {
                KeyboardController_1 = KeyboardController_1_1;
            }
        ],
        execute: function () {
            Application = class Application extends EventDispathcer_4.default {
                constructor(container) {
                    super();
                    Application.application = this;
                    this.initContainer(container);
                    this.init();
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
                    this.modules = new Modules_1.default();
                    this.keyboardController = new KeyboardController_1.default(this);
                }
            };
            exports_14("default", Application);
        }
    };
});
System.register("Main", ["framework/application/Application"], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var Application_1, Main;
    return {
        setters: [
            function (Application_1_1) {
                Application_1 = Application_1_1;
            }
        ],
        execute: function () {
            Main = class Main extends Application_1.default {
                constructor(container) {
                    super(container);
                }
            };
        }
    };
});
System.register("framework/application/events/ApplicationEvent", ["framework/core/events/Event"], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var Event_5, ApplicationEvent;
    return {
        setters: [
            function (Event_5_1) {
                Event_5 = Event_5_1;
            }
        ],
        execute: function () {
            ApplicationEvent = class ApplicationEvent extends Event_5.default {
                static get APPLICATION_KEYBOARD_KEYDOWN() { return "applicationKeyboardKeydown"; }
                static get APPLICATION_KEYBOARD_KEYUP() { return "applicationKeyboardKeyup"; }
                constructor(type) {
                    super(type, false, false);
                }
            };
            exports_16("default", ApplicationEvent);
        }
    };
});
//# sourceMappingURL=index.js.map