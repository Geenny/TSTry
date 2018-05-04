
import VO from '../../../framework/core/vo/VO';
import URL from '../../../framework/core/utils/URL';
import { RequestSecureState } from '../state/RequestSecureState';
import HTTPRequestHeaders from '../HTTPRequestHeaders';

export default class RequestVO extends VO {

    public url: string;

    public retry: number = 0;

    public secure: string;
    public server: string;
    public resource: string;
    public method: string;
    public headers: HTTPRequestHeaders[] = [];
    public data: string;

    public status: number = 0;

    public onSend: Function;
    public onComplete: Function;
    public onProgress: Function;
    public onError: Function;

    constructor( data: any = {} ) {
        super( data );
    }

    // GET/SET

    // TECH

    public update() {
        this.updateURL();
    }

    protected updateURL() {
        this.url = URL.compare( this.secure, this.server, this.resource );
    }

}