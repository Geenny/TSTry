import WindowService from '../WindowService';
import Event from '../../../events/Event';

export default class WindowEvent extends Event {

    // 
    public static get INIT(): string { return "windowInit"; }

    // TOTAL
    public static get OPEN(): string { return "windowOpen"; }
    public static get STATE(): string { return "windowState"; }

    // ANIMATION
    public static get ANIMATION_SHOW_START(): string { return "windowAnimationShowStart"; }
    public static get ANIMATION_SHOW_COMPLETE(): string { return "windowAnimationShowComplete"; }
    public static get ANIMATION_HIDE_START(): string { return "windowAnimationHideStart"; }
    public static get ANIMATION_HIDE_COMPLETE(): string { return "windowAnimationHideComplete"; }

    // FOCUS
    public static get FOCUS(): string { return "windowFocus"; }
    public static get UNFOCUS(): string { return "windowUnfocus"; }

    // VIEW
    public static get VIEW_CLEAR(): string { return "windowViewClear"; }
    public static get VIEW_DRAW_START(): string { return "windowViewDrawStart"; }
    public static get VIEW_DRAW_COMPLETE(): string { return "windowViewDrawComplete"; }
    

    public window: IWindow;
    public windowService: WindowService;

    constructor( type: string, window: IWindow = null, windowService: WindowService = null ) {

        super( type );

        this.window = window;
        this.windowService = windowService;

    }

}