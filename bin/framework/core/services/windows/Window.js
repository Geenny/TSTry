import EventDispathcer from '../../events/EventDispathcer';
import { WindowState } from './states/WindowState';
import WindowEvent from './events/WindowEvent';
import WindowVO from './vo/WindowVO';
import Log from '../../utils/Log';
export default class Window extends EventDispathcer {
    constructor(windowVO) {
        super();
        this._state = WindowState.NONE;
        this._correctState = WindowState.NONE;
        this._lockStateList = [];
        this.initVO(windowVO);
        this.init();
    }
    // 
    // GET/SET
    //
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get inited() { return this._inited; }
    set inited(value) { this._inited = value; }
    get state() { return this._state; }
    set state(value) { this._state = value; }
    get correctState() { return this._correctState; }
    set correctState(value) { this._correctState = value; }
    // Размер
    get width() { return this.vo.width; }
    set width(value) { this.vo.width = value; }
    get height() { return this.vo.height; }
    set height(value) { this.vo.height = value; }
    get type() { return this.vo.type; }
    get priority() { return this.vo.priority; }
    get group() { return this.vo.group; }
    get action() { return this.vo.action; }
    get unique() { return this.vo.unique; }
    set unique(value) { this.vo.unique = value; }
    get visible() { return this._visible; }
    set visible(value) { this._visible = value; }
    get focus() { return this._focus; }
    set focus(value) {
        if (value == this._focus)
            return;
        this._focus = value;
        this.dispatchEvent(new WindowEvent((value) ? WindowEvent.FOCUS : WindowEvent.UNFOCUS, this));
    }
    get ID() { return this.vo.ID; }
    get name() { return this.vo.name; }
    get vo() { return this._vo; }
    get service() { return this.vo.windowService; }
    // Фичи
    animated() { return this.vo.animation; }
    animationShowTime() { return this.vo.animationShowTime; }
    animationHideTime() { return this.vo.animationHideTime; }
    //
    // INIT
    //
    init() {
        this._inited = true;
        this._enable = true;
        this.setState(WindowState.WAIT);
        this.dispatchEvent(new WindowEvent(WindowEvent.INIT, this));
    }
    initVO(vo) {
        if (!vo)
            vo = new WindowVO();
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
    setState(state = WindowState.NONE) {
        if (this.state == state)
            return false;
        if (this.isLockState(state))
            return false;
        this.state = state;
        this.dispatchEvent(new WindowEvent(WindowEvent.STATE, this));
        return true;
    }
    /**
     * Данные @state заблокирован, для переключения окна в это состояние
     * @param state
     */
    isLockState(state) {
        return this._lockStateList.indexOf(state) != -1;
    }
    lockStateAdd(state) {
        if (this.isLockState(state) == false)
            this._lockStateList.push(state);
    }
    lockStateRemove(state) {
        let index = this._lockStateList.indexOf(state);
        if (index == -1)
            return;
        this._lockStateList.splice(index, 1);
    }
    //
    // WINDOW ACTIONS
    //
    /**
     * Откртие окна
     */
    open() {
        if (this.state != WindowState.WAIT)
            return;
        if (!this.setState(WindowState.OPEN))
            return;
        if (this.service.debug)
            Log.log(this.name + " OPEN");
        this.draw();
        this.animationShow();
    }
    close() {
        if (this.state != WindowState.OPEN && this.state != WindowState.HIDE)
            return;
        if (!this.setState(WindowState.CLOSE))
            return;
        this.animationHide();
    }
    // DRAW
    draw() {
        this.viewClear();
        this.viewDraw();
    }
    viewDraw() {
        this.dispatchEvent(new WindowEvent(WindowEvent.VIEW_DRAW_START, this));
    }
    viewDrawComplete() {
        this.dispatchEvent(new WindowEvent(WindowEvent.VIEW_DRAW_COMPLETE, this));
    }
    viewClear() {
        this.dispatchEvent(new WindowEvent(WindowEvent.VIEW_CLEAR, this));
    }
    // ANIMATION
    /**
     * Анимация отображения @Window
     */
    animationShow() {
        if (this.animated) {
            this.animationShowStart();
        }
        else {
            this.animationShowComplete();
        }
    }
    /**
     * Анимация скрытия @Window
     */
    animationHide() {
        if (this.animated) {
            this.animationHideStart();
        }
        else {
            this.animationHideComplete();
        }
    }
    /**
     * Запуск анимации отображения @Window
     */
    animationShowStart() {
        this.visible = true;
        this.dispatchEvent(new WindowEvent(WindowEvent.ANIMATION_SHOW_START, this));
        this.animationShowProcess();
    }
    /**
     * Завершение анимации отображения @Window
     */
    animationShowComplete() {
        this.dispatchEvent(new WindowEvent(WindowEvent.ANIMATION_SHOW_COMPLETE, this));
    }
    animationShowProcess() {
        this.animationShowComplete();
    }
    /**
     * Запуск анимации скрытия @Window
     */
    animationHideStart() {
        this.dispatchEvent(new WindowEvent(WindowEvent.ANIMATION_HIDE_START, this));
        this.animationHideProcess();
    }
    /**
     * Завершение анимации скрытия @Window
     */
    animationHideComplete() {
        this.dispatchEvent(new WindowEvent(WindowEvent.ANIMATION_HIDE_COMPLETE, this));
    }
    animationHideProcess() {
        this.animationHideComplete();
    }
    // DESTROY
    destroy() {
        this.viewClear();
    }
}
//# sourceMappingURL=Window.js.map