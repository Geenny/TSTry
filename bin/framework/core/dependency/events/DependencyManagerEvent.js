import Event from "../../events/Event";
export default class DependencyEvent extends Event {
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
}
//# sourceMappingURL=DependencyManagerEvent.js.map