import Controller from '../Controller';
import ApplicationEvent from '../../../application/events/ApplicationEvent';
import SourceKeyboardEventVO from './vo/SourceKeyboardEventVO';
export default class KeyboardController extends Controller {
    static get DOM_EVENT_KEYDOWN() { return "keydown"; }
    static get DOM_EVENT_KEYUP() { return "keyup"; }
    constructor(application) {
        super(application);
        this.init();
    }
    // GET/SET
    get container() { return this.application.container; }
    //
    init() {
        this.initListeners();
        KeyboardController.instance = this;
        this.target = this.application;
        this.inited = true;
    }
    // LISTENERS
    initListeners() {
        this.removeListeners();
        this.addListeners();
    }
    addListeners() {
        if (!this.container || this.listeners)
            return;
        this.listeners = true;
        this.container.addEventListener(KeyboardController.DOM_EVENT_KEYDOWN, this.onKeyDown);
        this.container.addEventListener(KeyboardController.DOM_EVENT_KEYUP, this.onKeyUp);
    }
    removeListeners() {
        if (!this.container)
            return;
        this.listeners = false;
        this.container.addEventListener(KeyboardController.DOM_EVENT_KEYDOWN, this.onKeyDown);
        this.container.addEventListener(KeyboardController.DOM_EVENT_KEYUP, this.onKeyUp);
    }
    // HANDLERS
    onKeyDown(event) {
        let controller = KeyboardController.instance;
        controller.dispatch(new ApplicationEvent(ApplicationEvent.APPLICATION_KEYBOARD_KEYDOWN, controller.getSourceKeyboardEventVO(event)));
    }
    onKeyUp(event) {
        let controller = KeyboardController.instance;
        controller.dispatch(new ApplicationEvent(ApplicationEvent.APPLICATION_KEYBOARD_KEYUP, controller.getSourceKeyboardEventVO(event)));
    }
    // DISPATCH
    dispatch(event) {
        if (!this.target)
            return;
        this.target.dispatchEvent(event);
    }
    // SOURCE VO
    getSourceKeyboardEventVO(event) {
        return new SourceKeyboardEventVO(event);
    }
}
//# sourceMappingURL=KeyboardController.js.map