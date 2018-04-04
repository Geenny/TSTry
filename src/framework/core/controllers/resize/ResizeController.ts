import Controller from '../Controller';
import Application from '../../../application/Application';
import ApplicationEvent from '../../../application/events/ApplicationEvent';
import Event from '../../events/Event';
import SourceResizeEventVO from './vo/SourceResizeEventVO';
import Log from '../../utils/Log';

export default class ResizeController extends Controller {

    public static get WINDOW_EVENT_RESIZE(): string { return "resize"; }

    public static instance: ResizeController;

    protected sourceResizeEventVO: SourceResizeEventVO;

    constructor( application: Application, options: any = null ) {
        super( application, options );
        this.init();
    }

    // GET/SET
    
    protected get container(): HTMLElement { return this.application.container; }

    public get width(): number { return this.sourceResizeEventVO.width; }
    public get height(): number { return this.sourceResizeEventVO.height; }

    // 

    public init() {
        this.initListeners();
        ResizeController.instance = this;
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
        window.addEventListener( ResizeController.WINDOW_EVENT_RESIZE, this.onResize );
    }
    private removeListeners() {
        if ( !this.container ) return;
        this.listeners = false;
        window.addEventListener( ResizeController.WINDOW_EVENT_RESIZE, this.onResize );
    }

    // HANDLERS

    private onResize( event: any ) {
        //Log.log( event );
        let controller: ResizeController = ResizeController.instance;
        controller.sourceResizeEventVO = controller.getSourceResizeEventVO( event );
        controller.dispatch( new ApplicationEvent( ApplicationEvent.APPLICATION_RESIZE, controller.sourceResizeEventVO ) );
    }

    // DISPATCH

    public dispatch( event: ApplicationEvent ) {
        if ( !this.target ) return;
        this.target.dispatchEvent( event );
    }

    // SOURCE VO

    public getSourceResizeEventVO( event: any ): SourceResizeEventVO {
        return new SourceResizeEventVO( event );
    }




}