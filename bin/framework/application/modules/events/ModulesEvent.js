import Event from '../../../core/events/Event';
export default class ModuleEvent extends Event {
    static get INIT() { return "modulesInit"; }
    static get COMPLETE() { return "modulesComplete"; }
    constructor(type, modules, module = null) {
        super(type, false, false);
        this.modules = modules;
        this.module = module;
    }
}
//# sourceMappingURL=ModulesEvent.js.map