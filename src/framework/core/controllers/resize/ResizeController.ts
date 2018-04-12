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
        ResizeController.instance = this;
        this.initListeners();
        this.resize();
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
        let controller: ResizeController = ResizeController.instance;
        controller.resize( event );
    }
    public resize( event: any = null) {
        this.sourceResizeEventVO = this.getSourceResizeEventVO( event );
        this.sourceResizeEventVO.width = this.container.clientWidth;
        this.sourceResizeEventVO.height = this.container.clientHeight;
        this.dispatch( new ApplicationEvent( ApplicationEvent.APPLICATION_RESIZE, this.sourceResizeEventVO ) );
    }

    // DISPATCH

    public dispatch( event: ApplicationEvent ) {
        if ( !this.target ) return;
        this.target.dispatchEvent( event );
    }

    // SOURCE VO

    public getSourceResizeEventVO( event: any = null): SourceResizeEventVO {
        let vo = new SourceResizeEventVO( event );
        vo.width = this.container.clientWidth;
        vo.height = this.container.clientHeight;
        return vo;
    }

}