import EventDispathcer from '../../framework/core/events/EventDispathcer';
import Application from '../../framework/application/Application';
import LauncherEvent from './events/LauncherEvent';

export default class Launcher extends EventDispathcer implements IState, IInit, IEnable, IDestroy {

    private _inited: boolean;
    private _enable: boolean;
    private _state: number | string;
    private _application: Application;

    constructor( application: Application ) {
        super();
    }

    // GET/SET

    public get inited(): boolean { return this._inited; }

    public get state(): number | string { return this._state; }
    public set state( value: number | string ) { this._state = value; }

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get application(): Application { return this._application; }
    public set application( value: Application ) { this._application = value; }

    // Init

    public init() {
        this._inited = true;
        this.dispatchEvent( new LauncherEvent( LauncherEvent.INIT, this ) );
    }

    // Destroy

    public destroy() { }

}