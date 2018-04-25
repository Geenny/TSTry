import EventDispathcer from '../../events/EventDispathcer';
import Application from '../../../application/Application';
import WindowServiceVO from './vo/WindowServiceVO';
import WindowEvent from './events/WindowEvent';
import Window from './Window';
import Event from '../../events/Event';
import WindowVO from './vo/WindowVO';
import WindowVOStorage from './WindowVOStorage';
import { WindowAction } from './states/WindowAction';
import Utils from '../../utils/Utils';
import Log from '../../utils/Log';

export default class WindowService extends EventDispathcer implements IEnable, IInit, IDestroy {

    /**
     * Класс обслуживания стака окон. Данный класс является менеджером окно @IWindow+@Window
     * Для инициализации класса, требуется ручной вызов метода init
     */

    private static _service: WindowService;

    /**
     * @WindowService доступный по умолчанию создан
     */
    public static get isService(): boolean {
        return !!this._service;
    }

    /**
     * @WindowService доступный по умолчанию
     */
    public static get service(): WindowService {
        if ( !WindowService._service ) WindowService._service = new WindowService( new WindowServiceVO() );
        return WindowService._service;
    }
    public static set service( service: WindowService ) {
        WindowService._service = service;
    }

    private _enable: boolean;
    private _inited: boolean;
    private _application: Application;
    private _debug: boolean = true;
    private _vo: WindowServiceVO;
    private _windows: IWindow[] = [];
    private _showed: IWindow[] = [];

    protected windowVOStorage: WindowVOStorage;
    
    constructor( vo: WindowServiceVO = null ) {
        super();

        this.initVO( vo );
        this.initWindowVOStorage();
        this.initWindowServiceGlobal();
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

    public get debug(): boolean { return this._debug; }
    public set debug( value: boolean ) { this._debug = value; }

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
    protected initWindowVOStorage() {
        this.windowVOStorage = new WindowVOStorage( this.vo.sourceVOList );
    }

    /**
     * Назначить 
     */
    protected initWindowServiceGlobal() {
        if ( WindowService.isService ) return;
        WindowService.service = this;
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

    // WINDOWS HANDLERS

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

    //
    // WINDOWs MANAGE
    // 

    /**
     * Создание @Window по стандартному или модифицированному @WindowVO
     * @param windowVO 
     */
    public windowOpen( windowVO: WindowVO = null ): Window {
        
        if ( !windowVO ) return null;
        if ( this.debug ) Log.log( windowVO.name + " OPEN." );
        if ( !this.isUnique( windowVO ) ) return null;

        let window: Window = new Window( windowVO );
        window.unique = this.windowCountUnique();

        this._windows.push( window );
        this.show( window );

        return window;

    }

    public windowClose( window: Window ) {

        let index: number = this._windows.indexOf( window );
        if ( index == -1 ) return;

        this._windows.splice( index, 1 );
        window.close();

    }

    /**
     * Вернуть окно по его @ID
     * @param ID 
     */
    public windowGetByID( ID: number | string ): Window {
        for ( let window of this._windows ) {
            if ( window.ID == ID ) return window as Window;
        }
        return null;
    }

    /**
     * Вернуть окно по его @unique
     * @param unique 
     */
    public windowGetByUniquie( unique: number ): Window {
        for ( let window of this._windows ) {
            if ( window.unique == unique ) return window as Window;
        }
        return null;
    }

    /**
     * Вернуть @unique которого нет среди доступных окон
     */
    protected windowCountUnique(): number {
        let unique: number = 0;
        for ( let i = 0; i < this.length; i++ ) {
            let window: Window = this._windows[ i ] as Window;
            if ( window.unique != unique ) continue;

            i = 0;
            unique ++;
        }
        return unique;
    }


    // SHOW MANAGE

    /**
     * Отображение окна
     * @param window 
     */
    protected show( window: Window ) {

        if ( !window ) return;

        let windowsListForStack: Window[] = [];
        let windowsListForClose: Window[] = [];

        for ( let i = 0; i < this.length; i++ ) {

            let windowInStack: Window = this._windows[ i ] as Window;

            // Если это то же окно - пропустить
            if ( windowInStack == window ) continue;

            // Проверить возможность наслоения на окно
            if ( this.windowCheckCompareShowPossibility( window, windowInStack ) ) {
                windowsListForStack.push( windowInStack );
            }

            // Проверить оказание влияния на окна, в частности инициацию закрытия
            if ( this.windowCheckCloseInfluence( window, windowInStack ) ) {
                windowsListForClose.push( windowInStack );
            }

        }

        if ( windowsListForStack.length == this.length - 1 ) {
            this.windowsClose( windowsListForClose );
            this.windowsFocusSet( windowsListForStack, false );
            window.open();
            window.focus = true;
        }

    }

    protected windowCheckCompareShowPossibility( windowForShow: Window, windowForCompare: Window ): boolean {

        // Для равный по условиям окон, проверяется только приоритет
        if ( windowForShow.action == windowForCompare.action ) {
            return this.windowPriorityCheck( windowForShow.priority, windowForCompare.priority );
        }

        if ( this.windowActionCheck( windowForShow.action, WindowAction.STRONG, WindowAction.INTERACTIVE ) ) {
            return false;
        }
        
        return true;

    }

    /**
     * Проверка оказания влияние на окно @windowForCompare окном @windowForShow
     * @param windowForShow 
     * @param windowForCompare 
     */
    protected windowCheckCloseInfluence( windowForShow: Window, windowForCompare: Window ): boolean {

        let influence = false;

        // Если окно @windowForCompare автоматически закрываемо, то влияние оказано
        if ( this.windowActionCheck( windowForCompare.action, WindowAction.AUTOCLOSE ) ) return true;

        // Если окно @windowForShow POPUP то влияние не оказано
        if ( this.windowActionCheck( windowForShow.action, WindowAction.POPUP ) ) influence = false;

        // Если окно @windowForShow CLOSEOTHER то оказывается влияние на всех, кроме STRONG и INTERACTIVE
        if ( this.windowActionCheck( windowForShow.action, WindowAction.CLOSEOTHER ) ) {
            influence = !( this.windowActionCheck( windowForCompare.action, WindowAction.STRONG, WindowAction.INTERACTIVE ) );
        }

        return influence;

    }

    /**
     * Определение наличия битного ключа @bitKey в битной маске @bitMask
     * @param bitMask 
     * @param bitKeys 
     */
    protected windowActionCheck( bitMask: number = 0, ...bitKeys ): boolean {
        for ( let value of bitKeys ) {
            if ( !Utils.bitmaskCheckKey( bitMask, value ) ) return false;
        }
        return true;
    }

    /**
     * Проверка приоритетов отображения окон. Приоритет имеет смысл проверять для однотипных окон
     * @param priorityForShow Приоритек окна, что должно быть создано
     * @param priorityForCompare Приоритет окна, с которым сравнивают и оно вероятнее всего уже открыто
     */
    protected windowPriorityCheck( priorityForShow: number, priorityForCompare: number ): boolean {
        return priorityForShow > priorityForCompare;
    }

    /**
     * Проверка @windowVO для сравнения типов
     * @param windowVO 
     */
    protected isUnique( windowVO: WindowVO ): boolean {
        for ( let window of this._windows ) {
            if ( window.name == windowVO.name ) return false;
        }
        return true;
    }

    /**
     * Потеря фокуса списком окон
     * @param windowsList 
     */
    protected windowsFocusSet( windowsList: Window[], focus: boolean = false ) {
        for ( let window of windowsList ) {
            this.windowFocusSet( window, focus );
        }
    }

    /**
     * Потеря фокуса окном
     * @param window 
     */
    protected windowFocusSet( window: Window, focus: boolean = false ) {
        window.focus = focus;
    }

    /**
     * Закрыть стак окон
     * @param windowsList 
     */
    protected windowsClose( windowsList: Window[] ) {

        // Закрытие окно сверху вниз
        for ( let i = windowsList.length - 1; i > -1; i++ ) {
            let window: Window = windowsList[ i ];
            this.windowClose( window );
        }
    }
    
}