import EventDispathcer from '../../framework/core/events/EventDispathcer';
import NetEvent from './events/NetEvent';
import RequestVO from './vo/RequestVO';
import Request from './Request';
import { RequestState } from './state/RequestState';
import HTTPRequest from './HTTPRequest';
import Log from '../../framework/core/utils/Log';
import NetVO from './vo/NetVO';

export default class Net extends EventDispathcer implements IInit, IEnable, IState {

    private static _instance: Net;

    /**
     * 
     */
    public static get instance(): Net {
        if ( !Net._instance ) {
            let net: Net = new Net();
            net.init();
            Net._instance = net;
        }
        return Net._instance;
    }

    /**
     * Отправка запроса через статический метод
     */
    public static send( requestVO: RequestVO ): Request {
        return Net.instance.send( requestVO );
    }

    // 
    private _inited: boolean;
    private _enable: boolean;
    private _state: number | string;
    private _requests: Request[] = [];
    private _sends: Request[] = [];

    private _vo: NetVO;

    constructor( netVO: NetVO = null ) {
        super();
        this.initInstance();
        this.initVO( netVO );
    }

    // GET/SET

    public get inited(): boolean { return this._inited; }

    public get state(): number | string { return this._state; }
    public set state( value: number | string ) { this._state = value; }

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get vo(): NetVO { return this._vo; }

    public get length(): number { return this._requests.length; }

    public get sendCount(): number { return this.vo.sendCount; }
    public get sendLength(): number { return this._sends.length; }
    public get sendCan(): boolean { return this.sendLength < this.sendCount && this.sendIsNotSended; }
    public get sendIsNotSended(): boolean {
        for ( let request of this._requests ) {
            if ( request.state == RequestState.NONE || request.state == RequestState.WAIT ) return true;
        }
        return false;
    }

    // Init

    public init() {
        this.senderInit();
        this._inited = true;
        this._enable = true;
        this.dispatchEvent( new NetEvent( NetEvent.INIT, this ) );
    }

    protected initVO( vo: NetVO ) {
        if ( !vo ) vo = new NetVO();
        this._vo = vo;
    }

    protected initInstance() {
        if ( Net._instance ) return;
        Net._instance = this;
    }

    // SEND

    /**
     * Отправка запроса
     * @param requestVO 
     */
    public send( requestVO: RequestVO ): Request {
        
        if ( !this.enable ) return null;

        let request: Request = this.createRequest( requestVO );
        request.state = RequestState.WAIT;

        this.next();

        return request;
    }

    //
    
    protected createRequest( requestVO: RequestVO ): Request {
        let request: Request = new Request( this.requestVOSet( requestVO ) );
        this._requests.push( request );

        return request;
    }

    protected next() {

        if ( !this.enable ) return;

        while( this.sendCan )
            this.sendNextProcess();
        
    }

    protected getNext(): Request {
        for ( let i = 0; i < this.length; i++ ) {
            let request: Request = this._requests[ i ];
            if ( request.state != RequestState.NONE && request.state != RequestState.WAIT ) continue;
            return request;
        }
        return null;
    }

    private sendNextProcess(): Request {

        let request: Request = this.getNext();
        if ( !request ) return null;

        return this.requestSend( request );

    }

    private requestSend( request: Request ): Request {

        let xhttp: HTTPRequest = this.xmlHttpRequestInstanceGet();
        xhttp.addEventListener( "readystatechange", this.onStatus );
        xhttp.addEventListener( "loadstart", this.onOpen );
        xhttp.addEventListener( "load", this.onLoad );
        xhttp.addEventListener( "progress", this.onProgress );
        xhttp.addEventListener( "error", this.onError );
        xhttp.addEventListener( "abort", this.onAbort );
        xhttp.request = request;

        request.httpRequest = xhttp;
        request.state = RequestState.PROCESS;
        this._sends.push( request );

        xhttp.open( request.method, request.url, true );
        xhttp.send( request.data );

        return request;

    }

    private requestVOSet( requestVO: RequestVO ): RequestVO {

        requestVO.secure = requestVO.secure || this.vo.secure;
        requestVO.server = requestVO.server || this.vo.server;
        requestVO.method = requestVO.method || this.vo.method;
        requestVO.headers = requestVO.headers || this.vo.headers;
        requestVO.retry = requestVO.retry || this.vo.retry;

        return requestVO;

    }

    private onStatus( event: any ) {
        Log.log( event );
    }
    private onOpen( event: any ) {
        Log.log( event );
    }
    private onLoad( event: any ) {
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

    /**
     * XMLHttpRequest
     */
    private xmlHttpRequestInstanceGet(): HTTPRequest {

        // code for modern browsers
        //if ( window[ "XMLHttpRequest" ] ) return new XMLHttpRequest();
        
        // code for old IE browsers
        //return new ActiveXObject("Microsoft.XMLHTTP");

        return new HTTPRequest();
    }

}