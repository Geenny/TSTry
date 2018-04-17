import EventDispathcer from '../../events/EventDispathcer';
import Application from '../../../application/Application';
import WindowServiceVO from './vo/WindowServiceVO';
import WindowEvent from './events/WindowEvent';
import Window from './Window';
import Event from '../../events/Event';

export default class WindowService extends EventDispathcer implements IEnable, IInit, IDestroy {

    private _enable: boolean;
    private _inited: boolean;
    private _application: Application;
    private _vo: WindowServiceVO;
    private _windows: IWindow[] = [];
    
    constructor( vo: WindowServiceVO = null ) {
        super();

        this.initVO( vo );
    }

    //
    // GET/SET
    //

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get inited(): boolean { return this._inited; }
    public set inited( value: boolean ) { this._inited = value; }

    public get application(): Application { return this._application; }
    public set application( value: Application ) { this._application = value; }

    protected get vo(): WindowServiceVO { return this._vo; }

    /**
     * Список элементов @IWindow
     */
    public get windows(): IWindow[] { return this._windows; }

    /**
     * Количество элементов @IWindow которые открыты
     */
    public get length(): number { return this._windows.length; }

    //
    // INIT
    // 

    public init() {
        this._enable = true;
        this._inited = true;
    }

    protected initVO( vo: WindowServiceVO ) {
        this._vo = ( vo ) ? vo : new WindowServiceVO();
    }


    //
    // WINDOW LISTENERS
    //

    protected addWidnowListeners( window: Window ): Window {
        if ( !window ) return null;
        window.addEventListener( Event.ANY, this.onWindow );
        return window;
    }

    protected removeWindowListeners( window: Window ): Window {
        if ( !window ) return null;
        window.removeEventListener( Event.ANY, this.onWindow );
        return window;
    }

    protected onWindow( event: WindowEvent ) {
        this.dispatchEvent( new WindowEvent( event.type, event.window, this ) );
    }

    // DESTROY

    public destroy() {
        while( this.length ) {
            let window: Window = this._windows.shift() as Window;
            this.removeWindowListeners( window );
            window.destroy();
        }
    }

}