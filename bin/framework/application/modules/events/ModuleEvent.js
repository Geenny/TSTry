import Event from '../../../core/events/Event';
export default class ModuleEvent extends Event {
    static get ERROR() { return "moduleError"; }
    static get DESTROY() { return "moduleDestroy"; }
    static get COMPLETE() { return "moduleComplete"; }
    static get CHANGE() { return "moduleChange"; }
    constructor(type, module) {
        super(type, false, false);
        this.module = module;
    }
}
//# sourceMappingURL=ModuleEvent.js.map