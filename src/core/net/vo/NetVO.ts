
import VO from '../../../framework/core/vo/VO';
import { RequestSecureState } from '../state/RequestSecureState';
import { RequestMethodState } from '../state/RequestMethodState';

export default class NetVO extends VO {

    // public retry: number = 5;
    
    // public secures: string[];
    // public servers: string[];

    // public secure: string = RequestSecureState.HTTP;
    // public server: string = "google.com";
    // public method: string = RequestMethodState.GET;
    // public headers: HTTPRequestHeaders[] = [];

    public maxSendCount: number = 5;

    public sendersOption: any[] = [];

    constructor( data: any = {} ) {
        super( data );
    }

}