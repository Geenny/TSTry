import EventDispathcer from '../events/EventDispathcer';
import Application from '../../application/Application';

export default abstract class Controller extends EventDispathcer implements IInit, IEnable {

    private _enable: boolean = true;
    private _inited: boolean;
    private _application: Application;
    private _target: EventDispathcer;

    protected listeners: boolean;
    protected options: any = {};

    constructor( application: Application, options: any = null ) {
        super();
        this.initApplication( application );
        this.initOptions( options );
    }

    private initApplication( application: Application ) {
        if ( !application ) return;
        this.application = application;
    }
    private initOptions( options: any ) {
        if ( !options ) return;
        this.options = options;
    }

    public init() {

    }

    // GET/SET

    
    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get inited(): boolean { return this._inited; }
    public set inited( value: boolean ) { this._inited = value; }

    public get application(): Application { return this._application; }
    public set application( value: Application ) { this._application = value; }

    public get target(): EventDispathcer { return this._target; }
    public set target( value: EventDispathcer ) { this._target = value; }

    // 



}