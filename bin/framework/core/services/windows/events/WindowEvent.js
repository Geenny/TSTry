import Event from '../../../events/Event';
export default class WindowEvent extends Event {
    // 
    static get INIT() { return "windowInit"; }
    // TOTAL
    static get OPEN() { return "windowOpen"; }
    static get STATE() { return "windowState"; }
    // ANIMATION
    static get ANIMATION_SHOW_START() { return "windowAnimationShowStart"; }
    static get ANIMATION_SHOW_COMPLETE() { return "windowAnimationShowComplete"; }
    static get ANIMATION_HIDE_START() { return "windowAnimationHideStart"; }
    static get ANIMATION_HIDE_COMPLETE() { return "windowAnimationHideComplete"; }
    // FOCUS
    static get FOCUS() { return "windowFocus"; }
    static get UNFOCUS() { return "windowUnfocus"; }
    // VIEW
    static get VIEW_CLEAR() { return "windowViewClear"; }
    static get VIEW_DRAW_START() { return "windowViewDrawStart"; }
    static get VIEW_DRAW_COMPLETE() { return "windowViewDrawComplete"; }
    constructor(type, window = null, windowService = null) {
        super(type);
        this.window = window;
        this.windowService = windowService;
    }
}
//# sourceMappingURL=WindowEvent.js.map