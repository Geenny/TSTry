
import Controller from '../Controller';
import Application from '../../../application/Application';
import Log from '../../utils/Log';
import ApplicationEvent from '../../../application/events/ApplicationEvent';
import SourceOrientationEventVO from './vo/SourceOrientationEventVO';

export default class OrientationController extends Controller {

    public static get DEVICEORIENTATIONCHANGE(): string { return "orientationchange"; }
    public static get DEVICEORIENTATION(): string { return "deviceorientation"; }
    public static get DEVICEMOTION(): string { return "devicemotion"; }

    public static instance: OrientationController;

    public acceleration: DeviceAcceleration;
    public accelerationIncludingGravity: DeviceAcceleration;
    public rotationRate: DeviceRotationRate;

    public absolute: number = 0;
    public alpha: number = 0;
    public beta: number = 0;
    public gamma: number = 0;

    constructor( application: Application, options: any = null ) {

        super( application, options );
        this.init();

    }

    public init() {

        OrientationController.instance = this;
        this.initListeners();
        this.target = this.application;
        this.inited = true;

    }

    protected initListeners() {

        window.addEventListener( OrientationController.DEVICEORIENTATIONCHANGE, this.onOrientationChange );
        window.addEventListener( OrientationController.DEVICEORIENTATION, this.onOrientation );
        window.addEventListener( OrientationController.DEVICEMOTION, this.onMotion );

    }

    // LISTENERS

    private onOrientationChange( event: any ) {
        let orientationController: OrientationController = OrientationController.instance;
        orientationController.dispatch( new ApplicationEvent( ApplicationEvent.APPLICATION_DEVICE_ORIENTATION_CHANGE, orientationController.sourceOrientationEventVO( event ) ) );
    }
    private onOrientation( event: any ) {

        let orientationController: OrientationController = OrientationController.instance;
        orientationController.absolute = event.absolute;
        orientationController.alpha = event.alpha;
        orientationController.beta = event.beta;         // ( -180, 180 )
        orientationController.gamma = event.gamma;       // ( -90, 90 )

        orientationController.dispatch( new ApplicationEvent( ApplicationEvent.APPLICATION_DEVICE_ORIENTATION, orientationController.sourceOrientationEventVO( event ) ) );

    }
    private onMotion( event: any ) {

        let orientationController: OrientationController = OrientationController.instance;
        orientationController.acceleration = event.acceleration;
        orientationController.accelerationIncludingGravity = event.accelerationIncludingGravity;
        orientationController.rotationRate = event.rotationRate;

        orientationController.dispatch( new ApplicationEvent( ApplicationEvent.APPLICATION_DEVICE_MOTION, orientationController.sourceOrientationEventVO( event ) ) );

    }

    // DISPATCH
    
    public dispatch( event: ApplicationEvent ) {
        if ( !this.target ) return;
        this.target.dispatchEvent( event );
    }

    // SOURCE VO

    public sourceOrientationEventVO( event: any = null): SourceOrientationEventVO {
        return new SourceOrientationEventVO( event );
    }

}