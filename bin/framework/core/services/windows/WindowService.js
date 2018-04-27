import EventDispathcer from '../../events/EventDispathcer';
import WindowServiceVO from './vo/WindowServiceVO';
import WindowEvent from './events/WindowEvent';
import Window from './Window';
import Event from '../../events/Event';
import WindowVOStorage from './WindowVOStorage';
import { WindowAction } from './states/WindowAction';
import Utils from '../../utils/Utils';
import Log from '../../utils/Log';
export default class WindowService extends EventDispathcer {
    constructor(vo = null) {
        super();
        this._debug = true;
        this._windows = [];
        this._showed = [];
        this.initVO(vo);
        this.initWindowVOStorage();
        this.initWindowServiceGlobal();
    }
    /**
     * @WindowService доступный по умолчанию создан
     */
    static get isService() {
        return !!this._service;
    }
    /**
     * @WindowService доступный по умолчанию
     */
    static get service() {
        if (!WindowService._service)
            WindowService._service = new WindowService(new WindowServiceVO());
        return WindowService._service;
    }
    static set service(service) {
        WindowService._service = service;
    }
    //
    // GET/SET
    //
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get inited() { return this._inited; }
    set inited(value) { this._inited = value; }
    get application() { return this._application; }
    set application(value) { this._application = value; }
    get debug() { return this._debug; }
    set debug(value) { this._debug = value; }
    get vo() { return this._vo; }
    /**
     * Список элементов @IWindow
     */
    get windows() { return this._windows; }
    /**
     * Количество элементов @IWindow которые открыты
     */
    get length() { return this._windows.length; }
    //
    // INIT
    // 
    init() {
        this._enable = true;
        this._inited = true;
    }
    initVO(vo) {
        this._vo = (vo) ? vo : new WindowServiceVO();
    }
    initWindowVOStorage() {
        this.windowVOStorage = new WindowVOStorage(this.vo.sourceVOList);
    }
    /**
     * Назначить
     */
    initWindowServiceGlobal() {
        if (WindowService.isService)
            return;
        WindowService.service = this;
    }
    //
    // WINDOW LISTENERS
    //
    addWidnowListeners(window) {
        if (!window)
            return null;
        window.addEventListener(Event.ANY, this.onWindow);
        return window;
    }
    removeWindowListeners(window) {
        if (!window)
            return null;
        window.removeEventListener(Event.ANY, this.onWindow);
        return window;
    }
    // WINDOWS HANDLERS
    onWindow(event) {
        this.dispatchEvent(new WindowEvent(event.type, event.window, this));
    }
    // DESTROY
    destroy() {
        while (this.length) {
            let window = this._windows.shift();
            this.removeWindowListeners(window);
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
    windowOpen(windowVO = null) {
        if (!windowVO)
            return null;
        if (this.debug)
            Log.log(windowVO.name + " OPEN.");
        if (this.isUnique(windowVO))
            return null;
        let window = new Window(windowVO);
        window.unique = this.windowCountUnique();
        this._windows.push(window);
        this.show(window);
        return window;
    }
    windowClose(window) {
        let index = this._windows.indexOf(window);
        if (index == -1)
            return;
        this._windows.splice(index, 1);
        window.close();
    }
    /**
     * Вернуть окно по его @ID
     * @param ID
     */
    windowGetByID(ID) {
        for (let window of this._windows) {
            if (window.ID == ID)
                return window;
        }
        return null;
    }
    /**
     * Вернуть окно по его @unique
     * @param unique
     */
    windowGetByUniquie(unique) {
        for (let window of this._windows) {
            if (window.unique == unique)
                return window;
        }
        return null;
    }
    /**
     * Вернуть @unique которого нет среди доступных окон
     */
    windowCountUnique() {
        let unique = 0;
        for (let i = 0; i < this.length; i++) {
            let window = this._windows[i];
            if (window.unique != unique)
                continue;
            i = 0;
            unique++;
        }
        return unique;
    }
    // SHOW MANAGE
    /**
     * Отображение окна
     * @param window
     */
    show(window) {
        if (!window)
            return;
        let windowsListForStack = [];
        let windowsListForClose = [];
        for (let i = 0; i < this.length; i++) {
            let windowInStack = this._windows[i];
            // Если это то же окно - пропустить
            if (windowInStack == window)
                continue;
            // Проверить возможность наслоения на окно
            if (this.windowCheckCompareShowPossibility(window, windowInStack)) {
                windowsListForStack.push(windowInStack);
            }
            // Проверить оказание влияния на окна, в частности инициацию закрытия
            if (this.windowCheckCloseInfluence(window, windowInStack)) {
                windowsListForClose.push(windowInStack);
            }
        }
        if (windowsListForStack.length == this.length - 1) {
            this.windowsClose(windowsListForClose);
            this.windowsFocusSet(windowsListForStack, false);
            window.open();
            window.focus = true;
        }
    }
    windowCheckCompareShowPossibility(windowForShow, windowForCompare) {
        // Для равный по условиям окон, проверяется только приоритет
        if (windowForShow.action == windowForCompare.action) {
            return this.windowPriorityCheck(windowForShow.priority, windowForCompare.priority);
        }
        if (this.windowActionCheck(windowForShow.action, WindowAction.STRONG, WindowAction.INTERACTIVE)) {
            return false;
        }
        return true;
    }
    /**
     * Проверка оказания влияние на окно @windowForCompare окном @windowForShow
     * @param windowForShow
     * @param windowForCompare
     */
    windowCheckCloseInfluence(windowForShow, windowForCompare) {
        let influence = false;
        // Если окно @windowForCompare автоматически закрываемо, то влияние оказано
        if (this.windowActionCheck(windowForCompare.action, WindowAction.AUTOCLOSE))
            return true;
        // Если окно @windowForShow POPUP то влияние не оказано
        if (this.windowActionCheck(windowForShow.action, WindowAction.POPUP))
            influence = false;
        // Если окно @windowForShow CLOSEOTHER то оказывается влияние на всех, кроме STRONG и INTERACTIVE
        if (this.windowActionCheck(windowForShow.action, WindowAction.CLOSEOTHER)) {
            influence = !(this.windowActionCheck(windowForCompare.action, WindowAction.STRONG, WindowAction.INTERACTIVE));
        }
        return influence;
    }
    /**
     * Определение наличия битного ключа @bitKey в битной маске @bitMask
     * @param bitMask
     * @param bitKeys
     */
    windowActionCheck(bitMask = 0, ...bitKeys) {
        for (let value of bitKeys) {
            if (!Utils.bitmaskCheckKey(bitMask, value))
                return false;
        }
        return true;
    }
    /**
     * Проверка приоритетов отображения окон. Приоритет имеет смысл проверять для однотипных окон
     * @param priorityForShow Приоритек окна, что должно быть создано
     * @param priorityForCompare Приоритет окна, с которым сравнивают и оно вероятнее всего уже открыто
     */
    windowPriorityCheck(priorityForShow, priorityForCompare) {
        return priorityForShow > priorityForCompare;
    }
    /**
     * Проверка @windowVO для сравнения типов
     * @param windowVO
     */
    isUnique(windowVO) {
        if (this.windowActionCheck(windowVO.action, WindowAction.UNIQUE)) {
            for (let window of this._windows) {
                if (window.name == windowVO.name)
                    return true;
            }
        }
        return false;
    }
    /**
     * Потеря фокуса списком окон
     * @param windowsList
     */
    windowsFocusSet(windowsList, focus = false) {
        for (let window of windowsList) {
            this.windowFocusSet(window, focus);
        }
    }
    /**
     * Потеря фокуса окном
     * @param window
     */
    windowFocusSet(window, focus = false) {
        window.focus = focus;
    }
    /**
     * Закрыть стак окон
     * @param windowsList
     */
    windowsClose(windowsList) {
        // Закрытие окно сверху вниз
        for (let i = windowsList.length - 1; i > -1; i--) {
            let window = windowsList[i];
            this.windowClose(window);
        }
    }
}
//# sourceMappingURL=WindowService.js.map