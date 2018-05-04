import { RequestState } from "./state/RequestState";
import RequestVO from "./vo/RequestVO";
import HTTPRequest from './HTTPRequest';
import URL from "../../framework/core/utils/URL";

export default class Request implements IState {

    private _state: number | string;
    private _vo: RequestVO;

    private _httpRequest: HTTPRequest;

    constructor( requestVO: RequestVO ) {
        this.initVO( requestVO );
        this.init();
    }

    // GET/SET

    public get state(): number | string { return this._state; }
    public set state( value: number | string ) { this._state = value; }

    protected get vo(): RequestVO { return this._vo; }
    
    public get httpRequest(): HTTPRequest { return this._httpRequest; }
    public set httpRequest( value: HTTPRequest ) { this._httpRequest = value; }
    
    public get status(): number { return this.vo.status; }
    public set status( value: number ) { this.vo.status = value; }

    // Общай ссылка
    public get url(): string { return this.vo.url; }
    public set url( value: string ) { this.vo.url = value; }

    public get method(): string { return this.vo.method; }

    // Раздельная ссылка из префикса безопасности, хоста и дополнительного суфикса ресурса
    public get secure(): string { return this.vo.secure; }
    public get server(): string { return this.vo.server; }
    public get resource(): string { return this.vo.resource; }

    public get data(): any { return this.vo.data; }

    // RequestVO

    protected init() {
        this.updateURL();
    }

    protected initVO( vo: RequestVO ) {
        this._vo = vo;
        this.updateURL();
    }

    protected updateURL() {
        this.url = URL.compare( this.secure, this.server, this.resource );
    }

}