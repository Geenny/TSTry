import EventDispathcer from '../../events/EventDispathcer';
import { ServiceState } from './states/ServiceState';
import ServiceEvent from './events/ServiceEvent';
export default class Service extends EventDispathcer {
    constructor(vo) {
        super();
        this.sourceVO = null;
        // ACTIVITY
        this.activityState = true;
        this.sourceVO = vo;
    }
    // GET/SET
    get inited() { return this._inited; }
    get ID() { return this._ID; }
    get name() { return this._name; }
    get description() { return this._description; }
    get state() { return this._state; }
    set state(value) { this._state = value; }
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get working() { return this.state == ServiceState.WORKING; }
    get isSupport() { return true; }
    // INIT 
    init() {
        this.activity(true);
        this.state = ServiceState.FREE;
    }
    // DESTROY
    destroy() {
        this.activity(false);
    }
    activity(value) {
        if (value == this.activityState)
            return;
        this.activityState = value;
        let event = new ServiceEvent((this.activityState) ? ServiceEvent.ACTIVE : ServiceEvent.DEACTIVE, this);
        this.dispatchEvent(event);
    }
}
//# sourceMappingURL=Service.js.map