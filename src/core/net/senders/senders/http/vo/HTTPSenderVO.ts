
import HTTPRequestHeader from '../../../../HTTPRequestHeader';
import SenderVO from '../../vo/SenderVO';
import { SenderConvertConst } from '../../../states/SenderConvertConst';

export default class HTTPSenderVO extends SenderVO {

    public headers: HTTPRequestHeader[] = [];
    public server: string;
    public resource: string;
    public method: string;
    public url: string;

    public convertSendData: string = SenderConvertConst.NONE;
    public sendTimeout: number = 20000;
    public sendTime: number = 0;

    constructor( data: any = null ) {

        super( data );

    }

}