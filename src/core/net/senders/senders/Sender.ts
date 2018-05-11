
import EventDispathcer from '../../../../framework/core/events/EventDispathcer';
import Request from '../../Request';
import SenderVO from './vo/SenderVO';

export default abstract class Sender extends EventDispathcer implements ISender, IInit, IID {

    private _ID: number = 0;
    private _main: boolean = false;
    private _inited: boolean = false;

    protected _vo: SenderVO;
    protected _requests: Request[] = [];

    constructor( senderVO: SenderVO ) {
        super();
        this.initVO( senderVO );
    }
    
    // GET/SET

    public get main(): boolean { return this._main; }
    public set main( value: boolean )  { this._main = value; }
    
    public get inited(): boolean { return this._inited; }
    public set inited( value: boolean ) { this._inited = value; }

    public get ID(): number { return this._ID; }

    public get length(): number { return 0; }
    public get requests(): Request[] { return this._requests; }
    public get isConnected(): boolean { return true; }

    public get vo(): SenderVO { return this._vo; }

    // Interface

    public send( request: Request ): Request {
        return request;
    }

    public cancel( request: Request ): boolean {
        return false;
    }

    public cancelAll() { }

    // INIT

    public init() { }

    protected initVO( senderVO: SenderVO ) {
        if ( !senderVO ) senderVO = new SenderVO();
        this._vo = senderVO;
    }



}