import Event from "../../events/Event";
export default class DependencyEvent extends Event {
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
}
//# sourceMappingURL=DependencyEvent.js.map