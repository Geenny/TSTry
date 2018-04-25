
import EventDispathcer from '../../events/EventDispathcer';
import { WindowState } from './states/WindowState';
import WindowEvent from './events/WindowEvent';
import WindowVO from './vo/WindowVO';
import Log from '../../utils/Log';
import WindowService from './WindowService';

export default class Window extends EventDispathcer implements IWindow, IDestroy, IEnable, IInit, IState {

    private _enable: boolean;
    private _inited: boolean;
    private _visible: boolean;
    private _focus: boolean;
    private _state: number = WindowState.NONE;
    private _correctState: number = WindowState.NONE;
    private _lockStateList: number[] = [];
    private _vo: WindowVO;

    constructor( windowVO: WindowVO ) {
        super();
        this.initVO( windowVO );
        this.init();
    }

    // 
    // GET/SET
    //

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get inited(): boolean { return this._inited; }
    public set inited( value: boolean ) { this._inited = value; }

    public get state(): number { return this._state; }
    public set state( value: number ) { this._state = value; }

    public get correctState(): number { return this._correctState; }
    public set correctState( value: number ) { this._correctState = value; }

    // Размер
    public get width(): number { return this.vo.width; }
    public set width( value: number ) { this.vo.width = value; }
    public get height(): number { return this.vo.height; }
    public set height( value: number ) { this.vo.height = value; }

    public get type(): string { return this.vo.type; }
    public get priority(): number { return this.vo.priority; }
    public get group(): string | number { return this.vo.group; }
    public get action(): number { return this.vo.action; }

    public get unique(): number { return this.vo.unique; }
    public set unique( value: number ) { this.vo.unique = value; }

    public get visible(): boolean { return this._visible; }
    public set visible( value: boolean ) { this._visible = value; }

    public get focus(): boolean { return this._focus; }
    public set focus( value: boolean ) {
        if ( value == this._focus ) return;
        this._focus = value;
        this.dispatchEvent( new WindowEvent( ( value ) ? WindowEvent.FOCUS : WindowEvent.UNFOCUS, this ) );
    }

    public get ID(): number | string { return this.vo.ID; }
    public get name(): string { return this.vo.name; }

    protected get vo(): WindowVO { return this._vo; }
    protected get service(): WindowService { return this.vo.windowService; }

    // Фичи
    public animated(): boolean { return this.vo.animation; }
    public animationShowTime(): number { return this.vo.animationShowTime; }
    public animationHideTime(): number { return this.vo.animationHideTime; }

    //
    // INIT
    //

    public init() {
        this._inited = true;
        this._enable = true;
        this.setState(WindowState.WAIT);
        this.dispatchEvent( new WindowEvent( WindowEvent.INIT, this ) );
    }

    public initVO( vo: WindowVO ) {
        if ( !vo ) vo = new WindowVO();
        this._vo = vo;
    }

    //
    // STATE
    //

    /**
     * Смена состояний окна. Переход может занимать время и промежуточные состояния.
     * Если смена была проведена, метод верней true.
     * @param state Состояние в которое переходит окно
     */
    protected setState( state: number = WindowState.NONE ): boolean {

        if ( this.state == state ) return false;
        if ( this.isLockState( state ) ) return false;

        this.state = state;
        this.dispatchEvent( new WindowEvent( WindowEvent.STATE, this ) );

        return true;

    }

    /**
     * Данные @state заблокирован, для переключения окна в это состояние
     * @param state 
     */
    public isLockState( state: number ): boolean {
        return this._lockStateList.indexOf( state ) != -1;
    }

    protected lockStateAdd( state: number ) {
        if ( this.isLockState( state ) == false )
            this._lockStateList.push( state );
    }
    protected lockStateRemove( state: number ) {
        let index: number = this._lockStateList.indexOf( state );
        if ( index == -1 ) return;
        this._lockStateList.splice( index, 1 );
    }


    //
    // WINDOW ACTIONS
    //

    /**
     * Откртие окна
     */
    public open() {

        if ( this.state != WindowState.WAIT ) return;
        if ( !this.setState( WindowState.OPEN ) ) return;
        if ( this.service.debug ) Log.log( this.name + " OPEN" );
        
        this.draw();
        this.animationShow();

    }

    public close() {

        if ( this.state != WindowState.OPEN && this.state != WindowState.HIDE ) return;
        if ( !this.setState( WindowState.CLOSE ) ) return;

        this.animationHide();

    }

    // DRAW

    protected draw() {
        this.viewDraw();
    }

    protected viewDraw() { }
    protected viewClear() { }

    // ANIMATION

    /**
     * Анимация отображения @Window
     */
    protected animationShow() {
        if ( this.animated ) {
            this.animationShowStart();
        }else{
            this.animationShowComplete();
        }
    }

    /**
     * Анимация скрытия @Window
     */
    protected animationHide() {
        if ( this.animated ) {
            this.animationHideStart();
        }else{
            this.animationHideComplete();
        }
    }

    /**
     * Запуск анимации отображения @Window
     */
    protected animationShowStart() {
        this.visible = true;
        this.dispatchEvent( new WindowEvent( WindowEvent.ANIMATION_SHOW_START, this ) );
        this.animationShowProcess();
    }

    /**
     * Завершение анимации отображения @Window
     */
    protected animationShowComplete() {
        this.dispatchEvent( new WindowEvent( WindowEvent.ANIMATION_SHOW_COMPLETE, this ) );
    }
    protected animationShowProcess() {
        this.animationShowComplete();
    }

    /**
     * Запуск анимации скрытия @Window
     */
    protected animationHideStart() {
        this.dispatchEvent( new WindowEvent( WindowEvent.ANIMATION_HIDE_START, this ) );
        this.animationHideProcess();
    }

    /**
     * Завершение анимации скрытия @Window
     */
    protected animationHideComplete() {
        this.dispatchEvent( new WindowEvent( WindowEvent.ANIMATION_HIDE_COMPLETE, this ) );
    }
    protected animationHideProcess() {
        this.animationHideComplete();
    }


    // DESTROY

    public destroy() {
        this.viewClear();
    }

}