import EventDispathcer from '../events/EventDispathcer';
import Application from '../../application/Application';
import Controller from './Controller';
import KeyboardController from './keyboard/KeyboardController';
import ResizeController from './resize/ResizeController';
import FocusController from './focus/FocusController';
import OrientationController from './orientation/OrientationController';

export default class Controllers extends EventDispathcer implements IInit, IEnable {

    private _enable: boolean;
    private _inited: boolean;
    private _application: Application;
    private _options: any;

    private _list: Controller[] = [];

    public controllerList: any[] = [
        KeyboardController,
        ResizeController,
        FocusController,
        OrientationController
    ]

    constructor( application: Application, options: any = null ) {
        super();

        this.application = application;
        this.options = options;

        this.init();
    }

    // GET/SET

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get inited(): boolean { return this._inited; }
    public set inited( value: boolean ) { this._inited = value; }

    public get application(): Application { return this._application; }
    public set application( value: Application ) { this._application = value; }

    public get options(): any { return this._options; }
    public set options( value: any ) { this._options = value; }

    //

    public init() {
        this.inited = true;
        this.addControllers( this.controllerList );
    }

    // CONTROLLERS

    private addControllers( list: string[] ) {

        for ( let ClassName of this.controllerList ) {
            let controller: Controller = new ClassName( this.application, null );
            this._list.push( controller );
        }

        // this.getOptionsForController( controllerClassName )

    }

    private getOptionsForController( className: string ): any {
        return ( this.options ) ? this.options[ className ] : null ;
    }


}