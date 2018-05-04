import Event from '../../../framework/core/events/Event';
import Net from '../Net';

export default class NetEvent extends Event {

    public static get INIT(): string { return "netInit"; }

    public net: Net;
    public request: Request;

    constructor( type: string, net: Net, request: Request = null ) {
        super( type, false, false );
        this.net = net;
        this.request = request;
    }

}