import EventDispathcer from '../../framework/core/events/EventDispathcer';
import NetEvent from './events/NetEvent';
import RequestVO from './vo/RequestVO';
import Request from './Request';
import { RequestState } from './state/RequestState';
import HTTPRequest from './HTTPRequest';
import Log from '../../framework/core/utils/Log';
import NetVO from './vo/NetVO';
import Utils from '../../framework/core/utils/Utils';
import Event from '../../framework/core/events/Event';
import RequestEvent from './events/RequestEvent';
import Sender from './senders/senders/Sender';
import SenderVO from './senders/senders/vo/SenderVO';

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
    //private _sends: Request[] = [];
    private _senders: ISender[] = [];

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

    // Init

    public init() {
        this.sendersInit();
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

        if ( this.senderSend( request ) ) return request;

        return null;
    }

    //
    
    protected createRequest( requestVO: RequestVO ): Request {
        let request: Request = new Request( requestVO );
        return request;
    }
    
    protected senderSend( request: Request ): boolean {

        let sender: ISender = this.senderGetByRequest( request );
        if ( !sender ) return false;

        sender.send( request );

    }

    /**
     * Вернуть ISender по RequestVO.senderID или ISender main которого равен true
     * @param request 
     */
    protected senderGetByRequest( request: Request ): ISender {

        let senderID: number = request.vo.senderID;
        let main: ISender;

        for ( let i = 0; i < this._senders.length; i++ ) {
            let sender: ISender = this._senders[ i ];
            if ( sender.main )
                main = sender;
            if ( senderID > 0 && senderID == sender.ID )
                return sender;
        }

        return null;

    }

    




    //
    // SENDERS
    //

    protected sendersInit() {

        for ( let options in this._vo.sendersOption ) {
            if ( !options ) continue;
            let ClassName: any = options.class;
            let sender: Sender = new ClassName( new SenderVO( options.senderData ) );
            this.senderAdd( sender );
        }

    }


    //
    // Sender
    //


    /**
     * Добавить ISender
     * @param sender 
     */
    public senderAdd( sender: ISender, init: boolean = true ): ISender {
        if ( !sender ) return null;
        if ( this.senderInNet( sender ) ) return sender;

        sender.ID = Utils.getNextID( this._senders );
        this._senders.push( sender );

        if ( !init ) return;
        this.senderInit( sender as Sender );
    }

    /**
     * Удалить ISender
     * @param sender 
     */
    public senderRemove( sender: ISender ): ISender {
        let index: number = this.senderIndexGet( sender );
        if ( index == -1 ) return null;

        this._senders.splice( index, 1 );

        return sender;
    }

    public senderGetByID( ID: number ): ISender {
        for ( let i = 0; i < this._senders.length; i++ ) {
            let sender: ISender = this._senders[ i ];
            if ( sender.ID == ID ) return sender;
        }
        return null;
    }

    protected senderInNet( sender: ISender ): boolean {
        return this.senderIndexGet( sender ) >= 0;
    }

    protected senderIndexGet( sender: ISender ): number {
        return this._senders.indexOf( sender );
    }

    protected senderInit( sender: Sender ) {
        if ( !sender ) return;
        if ( sender.hasEventListener( Event.ANY ) ) return;
        
        sender.addEventListener( Event.ANY, this.onSender );
        sender.init();
    }

    protected onSender( event: RequestEvent ) {

    }

}