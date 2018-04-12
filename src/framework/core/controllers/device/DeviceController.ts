
import Controller from '../Controller';
import Application from '../../../application/Application';

export default class DeviceController extends Controller {

    constructor( application: Application, options: any = null ) {

        super( application, options );

    }

    public get isMobile(): boolean {
        return !!( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i) );
    }
    
}