import Controller from '../Controller';
import ApplicationEvent from '../../../application/events/ApplicationEvent';
import SourceFocusEventVO from './vo/SourceFocusEventVO';
export default class FocusController extends Controller {
    static get DOM_EVENT_FOCUS() { return "focus"; }
    static get DOM_EVENT_BLUR() { return "blur"; }
    constructor(application, options = null) {
        super(application, options);
        this.init();
    }
    // GET/SET
    get container() { return this.application.container; }
    // 
    init() {
        this.initListeners();
        FocusController.instance = this;
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
        this.container.onfocus = this.onFocus;
        this.container.onblur = this.onBlur;
    }
    removeListeners() {
        if (!this.container)
            return;
        this.listeners = false;
        this.container.onfocus = null;
        this.container.onblur = null;
    }
    // HANDLERS
    onFocus(event) {
        let controller = FocusController.instance;
        controller.dispatch(new ApplicationEvent(ApplicationEvent.APPLICATION_FOCUS, controller.getSourceFocusEventVO(event)));
    }
    onBlur(event) {
        let controller = FocusController.instance;
        controller.dispatch(new ApplicationEvent(ApplicationEvent.APPLICATION_BLUR, controller.getSourceFocusEventVO(event)));
    }
    // DISPATCH
    dispatch(event) {
        if (!this.target)
            return;
        this.target.dispatchEvent(event);
    }
    // SOURCE VO
    getSourceFocusEventVO(event) {
        return new SourceFocusEventVO(event);
    }
}
//# sourceMappingURL=FocusController.js.map