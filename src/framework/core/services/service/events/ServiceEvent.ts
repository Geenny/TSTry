import Event from '../../../events/Event';

export default class ServiceEvent extends Event {

    public static ACTIVE: string = "serviceActive";
    public static DEACTIVE: string = "serviceDeactive";
    public static WORKING: string = "serviceWorking";
    public static COMPLETE: string = "serviceComplete";
    public static WAIT: string = "serviceWait";

    public service: IService;

    constructor( type: string, service: IService ) {
        super( type, false, false );
        this.service = service;
    }

}