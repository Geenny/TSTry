
import Event from '../../../framework/core/events/Event';

export default class RequestEvent extends Event {

    public static get INIT(): string { return "requestInit"; }
    public static get OPEN(): string { return "requestOpen"; }
    public static get SEND(): string { return "requestSend"; }
    public static get PROGRESS(): string { return "requestProgress"; }
    public static get COMPLETE(): string { return "requestComplete"; }
    public static get ERROR(): string { return "requestError"; }

    constructor( type: string ) {

        super( type, false, false );

    }

}