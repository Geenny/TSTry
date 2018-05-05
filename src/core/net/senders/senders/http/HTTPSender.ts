import EventDispathcer from '../../../../../framework/core/events/EventDispathcer';
import Request from '../../../Request';
import HTTPRequest from '../../../HTTPRequest';
import RequestEvent from '../../../events/RequestEvent';
import Log from '../../../../../framework/core/utils/Log';
import HTTPRequestHeaders from '../../../HTTPRequestHeaders';
import { SenderConvertConst } from '../../states/SenderConvertConst';
import { RequestState } from '../../../state/RequestState';
import HTTPRequestHeader from '../../../HTTPRequestHeader';

export default class HTTPSender extends EventDispathcer implements ISender, IInit {

    private _serverOptions: ServerOptions = new ServerOptions();

    private _inited: boolean;
    private _connected: boolean;
    private _requests: Request[] = [];
    private _structs: HTTPStruct[] = [];
    private _ID: number = 0;
    private _main: boolean;
    private _method: string;
    private _url: string;
    private _vo: SenderVO;

    constructor( senderVO: SenderVO ) {
        super();
        this.initVO( serverVO );
    }

    // GET/SET

    public get ID(): number { return this._ID; }
    public get main(): boolean { return this._main; }
    public set main( value: boolean )  { this._main = value; }

    public get headers(): HTTPRequestHeader[] { return this.vo.headers; }
    public get method(): string { return this.vo.method; }
    public get url(): string { return this.vo.url; }
    
    public get inited(): boolean { return this._inited; }
    public set inited( value: boolean ) { this._inited = value; }

    public get vo(): SenderVO { return this._vo; }

    // Interface

    public get isConnected(): boolean { return this._connected; } 

    public get length(): number { return this._requests.length; }

    public get requests(): Request[] { return this._requests; }

    public send( request: Request ): Request {
        
        let xhttp: HTTPRequest = this.xhttpCreate( request );
        let struct: HTTPStruct = new HTTPStruct( request, xhttp );

        this.structAdd( struct );
        this.sendByStruct( struct );

        return request;

    }

    // INIT

    public init() {
        this._inited = true;
        this.dispatchEvent( new RequestEvent( RequestEvent.INIT ) );
    }

    protected initVO( senderVO: SenderVO ) {
        if ( !senderVO ) senderVO = new SenderVO();
        this._vo = senderVO;
    }

    // SEND

    protected sendByStruct( struct: HTTPStruct ) {

        let line: string = this.dataConvert( struct.request.data );

        struct.request.state = RequestState.PROCESS;
        struct.xhttp.send( struct.request.data );

    }

    // Преобразовать данные для отправки
    private dataConvert( data: any ): string {

        if ( !data ) return "null";
        if ( typeof data == "object" ) {
            if ( this.vo.convertSendData == SenderConvertConst.JSON )
                return JSON.stringify( data );
        }

        return String( data );

    }

    // REQUEST

    // Очистить
    private destroyByRequest( request: Request ) {
        this.destroyByStruct( this.structByRequest( request ) );
    }

    private destroyByStruct( struct: HTTPStruct ) {

        let request: Request = struct.request;
        let xhttp: HTTPRequest = struct.xhttp;

        request.removeEventListeners();
        this.xhttpDestroy( xhttp );
    }



    // XHTTP

    protected xhttpCreate( request: Request ): HTTPRequest {

        let xhttp: HTTPRequest = new HTTPRequest();

        xhttp.addEventListener( "readystatechange", this.onStatus );
        xhttp.addEventListener( "loadstart", this.onOpen );
        xhttp.addEventListener( "load", this.onComplete );
        xhttp.addEventListener( "progress", this.onProgress );
        xhttp.addEventListener( "error", this.onError );
        xhttp.addEventListener( "abort", this.onAbort );
        xhttp.open( this.method, this.url, true );
        this.xhttpHeadresAdd( xhttp );

        xhttp.request = request;

        return xhttp;

    }

    protected xhttpDestroy( xhttp: HTTPRequest ) {

        xhttp.removeEventListener( "readystatechange", this.onStatus );
        xhttp.removeEventListener( "loadstart", this.onOpen );
        xhttp.removeEventListener( "load", this.onComplete );
        xhttp.removeEventListener( "progress", this.onProgress );
        xhttp.removeEventListener( "error", this.onError );
        xhttp.removeEventListener( "abort", this.onAbort );
        xhttp.request = null;
        xhttp = null;

    }

    protected xhttpHeadresAdd( xhttp: HTTPRequest ) {
        for ( let i = 0; i < this.headers.length; i++ ) {
            let header: HTTPRequestHeader = this.headers[ i ];
            xhttp.setRequestHeader( header.key, header.value );
        }
    }

    private onStatus( event: any ) {
        Log.log( event );
        //let struct: HTTPStruct = this
    }
    private onOpen( event: any ) {
        Log.log( event );
    }
    private onComplete( event: any ) {
        Log.log( event );
    }
    private onProgress( event: any ) {
        Log.log( event );
    }
    private onError( event: any ) {
        Log.log( event );
    }
    private onAbort( event: any ) {
        Log.log( event );
    }

    // STRUCT

    protected structByRequest( request: Request ): HTTPStruct {
        for ( let struct of this._structs ) {
            if ( struct.request == request )
                return struct;
        }
        return null;
    }

    private structAdd( struct: HTTPStruct ) {
        this._structs.push( struct );
    }
    private structRemove( struct: HTTPStruct ) {
        let index: number = this._structs.indexOf( struct );
        if ( index < 0 ) return;
        this._structs.splice( index, 1 );
    }

}

class HTTPStruct {

    public request: Request;
    public xhttp: HTTPRequest;

    constructor( request: Request, xhttp: HTTPRequest ) {

        this.request = request;
        this.xhttp = xhttp;

    }

}