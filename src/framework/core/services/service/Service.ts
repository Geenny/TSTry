import EventDispathcer from '../../events/EventDispathcer';
import ServiceVO from './vo/ServiceVO';
import { ServiceState } from './states/ServiceState';
import ServiceEvent from './events/ServiceEvent';

export default class Service extends EventDispathcer implements IService, IInfo, IState, IInit, IEnable, IDestroy {

    private _inited: boolean;
    private _state: number;
    private _ID: number;
    private _name: string;
    private _description: string;
    private _enable: boolean;

    protected sourceVO: ServiceVO = null;

    constructor( vo: ServiceVO ) {
        super();
        this.sourceVO = vo;
    }

    // GET/SET

    public get inited(): boolean { return this._inited; }

    public get ID(): number { return this._ID; }
    public get name(): string { return this._name; }
    public get description(): string { return this._description; }

    public get state(): number { return this._state; }
    public set state( value: number ) { this._state = value; }

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get working(): boolean { return this.state == ServiceState.WORKING }
    public get isSupport(): boolean { return true; }

    // INIT 

    public init() {
        this.activity( true );
        this.state = ServiceState.FREE;
    }

    // DESTROY

    public destroy() {
        this.activity( false );
    }

    // ACTIVITY

    protected activityState: boolean = true;

    public activity( value: boolean ) {
        if ( value == this.activityState ) return;
        this.activityState = value;

        let event: ServiceEvent = new ServiceEvent( ( this.activityState ) ? ServiceEvent.ACTIVE : ServiceEvent.DEACTIVE, this );
        this.dispatchEvent( event );

    }

}