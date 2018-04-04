import Application from '../../../application/Application';
import Log from '../../utils/Log';
import Controller from '../Controller';
import ApplicationEvent from '../../../application/events/ApplicationEvent';
import SourceKeyboardEventVO from './vo/SourceKeyboardEventVO';

export default class KeyboardController extends Controller {

    public static get DOM_EVENT_KEYDOWN(): string { return "keydown"; }
    public static get DOM_EVENT_KEYUP(): string { return "keyup"; }

    public static instance: KeyboardController;

    constructor( application: Application ) {
        super( application );
        this.init();
    }

    // GET/SET

    protected get container(): HTMLElement { return this.application.container; }

    //

    public init() {
        this.initListeners();
        KeyboardController.instance = this;
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
        this.container.addEventListener( KeyboardController.DOM_EVENT_KEYDOWN, this.onKeyDown );
        this.container.addEventListener( KeyboardController.DOM_EVENT_KEYUP, this.onKeyUp );
    }
    private removeListeners() {
        if ( !this.container ) return;
        this.listeners = false;
        this.container.addEventListener( KeyboardController.DOM_EVENT_KEYDOWN, this.onKeyDown );
        this.container.addEventListener( KeyboardController.DOM_EVENT_KEYUP, this.onKeyUp );
    }

    // HANDLERS

    private onKeyDown( event: any ) {
        let controller: KeyboardController = KeyboardController.instance;
        controller.dispatch( new ApplicationEvent( ApplicationEvent.APPLICATION_KEYBOARD_KEYDOWN, controller.getSourceKeyboardEventVO( event ) ) );
    }
    private onKeyUp( event: any ) {
        let controller: KeyboardController = KeyboardController.instance;
        controller.dispatch( new ApplicationEvent( ApplicationEvent.APPLICATION_KEYBOARD_KEYUP, controller.getSourceKeyboardEventVO( event ) ) );
    }

    // DISPATCH

    private dispatch( event: ApplicationEvent ) {
        if ( !this.target ) return;
        this.target.dispatchEvent( event );
    }

    // SOURCE VO

    public getSourceKeyboardEventVO( event ): SourceKeyboardEventVO {
        return new SourceKeyboardEventVO( event );
    }

}