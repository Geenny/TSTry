import EventDispathcer from '../../events/EventDispathcer';
import Application from '../../../application/Application';
import WindowServiceVO from './vo/WindowServiceVO';

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

    //
    // INIT
    // 

    public init() {
        this.enable = true;
    }

    protected initVO( vo: WindowServiceVO ) {
        this._vo = ( vo ) ? vo : new WindowServiceVO();
    }

    // DESTROY

    public destroy() {

    }

}