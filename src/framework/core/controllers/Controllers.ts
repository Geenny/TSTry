import EventDispathcer from '../events/EventDispathcer';
import Application from '../../application/Application';
import Controller from './Controller';
import ControllersVO from './ControllersVO';

export default class Controllers extends EventDispathcer implements IInit, IEnable {

    private _enable: boolean;
    private _inited: boolean;
    private _application: Application;
    private _options: any;
    private _vo: ControllersVO;

    private _list: Controller[] = [];

    constructor( application: Application, controllersVO: ControllersVO = null ) {
        super();

        this.application = application;
        this.initControllersVO( controllersVO );

        this.init();
    }

    // GET/SET

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get inited(): boolean { return this._inited; }
    public set inited( value: boolean ) { this._inited = value; }

    public get application(): Application { return this._application; }
    public set application( value: Application ) { this._application = value; }

    protected get vo(): ControllersVO { return this._vo; }

    protected get controllerList(): any[] { return this.vo.controllerList; }

    //

    public init() {
        this.inited = true;
        this.addControllers( this.controllerList );
    }

    public initControllersVO( controllersVO: ControllersVO ) {
        this._vo = ( controllersVO ) ? controllersVO : new ControllersVO();
    }

    // CONTROLLERS

    /**
     * Добавление всех контроллеров по списку
     * @param list 
     */
    private addControllers( list: string[] ) {

        for ( let ClassName of this.controllerList ) {
            let controller: Controller = new ClassName( this.application, this.getOptionsForController( ClassName.name ) );
            this._list.push( controller );
        }

    }

    private getOptionsForController( className: string ): any {
        return  ( this.vo[ className ] ) ? this.vo[ className ] : this.vo.data[ className ];
    }


}