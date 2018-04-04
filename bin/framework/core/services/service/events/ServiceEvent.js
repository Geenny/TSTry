import Event from '../../../events/Event';
export default class ServiceEvent extends Event {
    constructor(type, service) {
        super(type, false, false);
        this.service = service;
    }
}
ServiceEvent.ACTIVE = "serviceActive";
ServiceEvent.DEACTIVE = "serviceDeactive";
ServiceEvent.WORKING = "serviceWorking";
ServiceEvent.COMPLETE = "serviceComplete";
ServiceEvent.WAIT = "serviceWait";
//# sourceMappingURL=ServiceEvent.js.map