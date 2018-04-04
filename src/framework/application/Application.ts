import EventDispathcer from '../core/events/EventDispathcer';
import Modules from './modules/Modules';
import KeyboardController from '../core/controllers/keyboard/KeyboardController';
import ResizeController from '../core/controllers/resize/ResizeController';
import Controller from '../core/controllers/Controller';
import Controllers from '../core/controllers/Controllers';

export default class Application extends EventDispathcer implements IInit {

    public static application: Application;

    private _inited: boolean;
    private _started: boolean;

    private _container: HTMLElement;

    protected controllerOptions: any = null;

    public modules: Modules;
    public controllers: Controllers;

    constructor( container: HTMLElement ) {

        super();

        Application.application = this;

        this.initContainer( container );

    }

    //
    // GET/SET
    //

    public get inited(): boolean { return this._inited; }

    public get started(): boolean { return this._started; }
    public set started( value: boolean) { this._started = value; }

    public get container(): HTMLElement { return this._container; }

    // INIT

    public initContainer( container: HTMLElement ) {
        this._container = container;
    }

    public init() {
        this.modules = new Modules();
        this.controllers = new Controllers( this, this.controllerOptions );
    }

    //
    // MODULES
    // 



}