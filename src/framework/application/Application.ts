import EventDispathcer from '../core/events/EventDispathcer';
import Modules from './modules/Modules';
import KeyboardController from '../core/controllers/keyboard/KeyboardController';
import ResizeController from '../core/controllers/resize/ResizeController';
import Controller from '../core/controllers/Controller';
import Controllers from '../core/controllers/Controllers';
import ApplicationEvent from './events/ApplicationEvent';

export default class Application extends EventDispathcer implements IInit {

    public static instance: Application;

    public modules: Modules;
    public controllers: Controllers;

    protected controllerOptions: any = null;

    private _inited: boolean;
    private _started: boolean;
    private _pause: boolean;

    private _container: HTMLElement;

    constructor( container: HTMLElement ) {

        super();

        Application.instance = this;

        this.initContainer( container );

    }

    //
    // GET/SET
    //

    public get inited(): boolean { return this._inited; }

    public get started(): boolean { return this._started; }
    public set started( value: boolean) { this._started = value; }

    public get container(): HTMLElement { return this._container; }

    public get pause(): boolean { return this._pause; }
    public set pause( value: boolean ) {
        if ( this._pause == value ) return;
        this._pause = value;
        this.setPause();
        this.dispatchEvent( new ApplicationEvent( ApplicationEvent.APPLICATION_PAUSE, null ) )
    }

    // INIT

    public initContainer( container: HTMLElement ) {
        this._container = container;
    }

    public init() {
        this.modules = new Modules();
        this.controllers = new Controllers( this, this.controllerOptions );
        this._inited = true;
    }

    //
    // MODULES
    // 

    //
    // TECH
    //

    /**
     * Установка паузы
     */
    protected setPause() {
        this.modules.enable = !this._pause;
        this.controllers.enable = !this._pause;
    }



}