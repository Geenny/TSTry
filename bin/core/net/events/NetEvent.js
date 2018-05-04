import Event from '../../../framework/core/events/Event';
export default class NetEvent extends Event {
    static get INIT() { return "netInit"; }
    constructor(type, net, request = null) {
        super(type, false, false);
        this.net = net;
        this.request = request;
    }
}
//# sourceMappingURL=NetEvent.js.map