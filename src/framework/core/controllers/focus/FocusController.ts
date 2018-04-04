import Controller from '../Controller';
import Application from '../../../application/Application';
import Log from '../../utils/Log';
import ApplicationEvent from '../../../application/events/ApplicationEvent';
import SourceFocusEventVO from './vo/SourceFocusEventVO';

export default class FocusController extends Controller {

    public static get DOM_EVENT_FOCUS(): string { return "focus"; }
    public static get DOM_EVENT_BLUR(): string { return "blur"; }

    public static instance: FocusController;

    constructor( application: Application, options: any = null ) {
        super( application, options );
        this.init();
    }

    // GET/SET

    protected get container(): HTMLElement { return this.application.container; }

    // 

    public init() {
        this.initListeners();
        FocusController.instance = this;
        this.target = this.application;
        this.inited = true;
    }

    // LISTENERS

    private initListeners() {
        this.removeListeners();
        this.addListeners();
    }
    private addListeners() {
        if ( !this.container || this.listeners ) return;
        this.listeners = true;
        this.container.onfocus = this.onFocus;
        this.container.onblur = this.onBlur;
    }
    private removeListeners() {
        if ( !this.container ) return;
        this.listeners = false;
        this.container.onfocus = null;
        this.container.onblur = null;
    }

    // HANDLERS

    private onFocus( event: any ) {
        let controller: FocusController = FocusController.instance;
        controller.dispatch( new ApplicationEvent( ApplicationEvent.APPLICATION_FOCUS, controller.getSourceFocusEventVO( event ) ) );
    }
    private onBlur( event: any ) {
        let controller: FocusController = FocusController.instance;
        controller.dispatch( new ApplicationEvent( ApplicationEvent.APPLICATION_BLUR, controller.getSourceFocusEventVO( event ) ) );
    }

    // DISPATCH

    public dispatch( event: ApplicationEvent ) {
        if ( !this.target ) return;
        this.target.dispatchEvent( event );
    }

    // SOURCE VO

    public getSourceFocusEventVO( event: any ): SourceFocusEventVO {
        return new SourceFocusEventVO( event );
    }

}