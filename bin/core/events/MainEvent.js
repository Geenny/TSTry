import Event from '../../framework/core/events/Event';
export default class MainEvent extends Event {
    static get INIT() { return "mainInit"; }
    static get DEPENDENCY_INIT() { return "mainDependencyInit"; }
    static get DEPENDENCY_PROGRESS() { return "mainDependencyProgress"; }
    static get DEPENDENCY_COMPLETE() { return "mainDependencyComplete"; }
    constructor(type, data) {
        super(type, false, false);
        this.data = data;
    }
}
//# sourceMappingURL=MainEvent.js.map