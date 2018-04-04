import Controller from '../Controller';
import ApplicationEvent from '../../../application/events/ApplicationEvent';
import SourceResizeEventVO from './vo/SourceResizeEventVO';
export default class ResizeController extends Controller {
    static get WINDOW_EVENT_RESIZE() { return "resize"; }
    constructor(application, options = null) {
        super(application, options);
        this.init();
    }
    // GET/SET
    get container() { return this.application.container; }
    get width() { return this.sourceResizeEventVO.width; }
    get height() { return this.sourceResizeEventVO.height; }
    // 
    init() {
        ResizeController.instance = this;
        this.initListeners();
        this.resize();
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
        window.addEventListener(ResizeController.WINDOW_EVENT_RESIZE, this.onResize);
    }
    removeListeners() {
        if (!this.container)
            return;
        this.listeners = false;
        window.addEventListener(ResizeController.WINDOW_EVENT_RESIZE, this.onResize);
    }
    // HANDLERS
    onResize(event) {
        let controller = ResizeController.instance;
        controller.resize(event);
    }
    resize(event = null) {
        this.sourceResizeEventVO = this.getSourceResizeEventVO(event);
        this.sourceResizeEventVO.width = this.container.clientWidth;
        this.sourceResizeEventVO.height = this.container.clientHeight;
        this.dispatch(new ApplicationEvent(ApplicationEvent.APPLICATION_RESIZE, this.sourceResizeEventVO));
    }
    // DISPATCH
    dispatch(event) {
        if (!this.target)
            return;
        this.target.dispatchEvent(event);
    }
    // SOURCE VO
    getSourceResizeEventVO(event = null) {
        let vo = new SourceResizeEventVO(event);
        vo.width = this.container.clientWidth;
        vo.height = this.container.clientHeight;
        return vo;
    }
}
//# sourceMappingURL=ResizeController.js.map