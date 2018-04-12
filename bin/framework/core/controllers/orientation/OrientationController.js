import Controller from '../Controller';
import ApplicationEvent from '../../../application/events/ApplicationEvent';
import SourceOrientationEventVO from './vo/SourceOrientationEventVO';
export default class OrientationController extends Controller {
    constructor(application, options = null) {
        super(application, options);
        this.absolute = 0;
        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;
        this.init();
    }
    static get DEVICEORIENTATIONCHANGE() { return "orientationchange"; }
    static get DEVICEORIENTATION() { return "deviceorientation"; }
    static get DEVICEMOTION() { return "devicemotion"; }
    init() {
        OrientationController.instance = this;
        this.initListeners();
        this.target = this.application;
        this.inited = true;
    }
    initListeners() {
        window.addEventListener(OrientationController.DEVICEORIENTATIONCHANGE, this.onOrientationChange);
        window.addEventListener(OrientationController.DEVICEORIENTATION, this.onOrientation);
        window.addEventListener(OrientationController.DEVICEMOTION, this.onMotion);
    }
    // LISTENERS
    onOrientationChange(event) {
        let orientationController = OrientationController.instance;
        orientationController.dispatch(new ApplicationEvent(ApplicationEvent.APPLICATION_DEVICE_ORIENTATION_CHANGE, orientationController.sourceOrientationEventVO(event)));
    }
    onOrientation(event) {
        let orientationController = OrientationController.instance;
        orientationController.absolute = event.absolute;
        orientationController.alpha = event.alpha;
        orientationController.beta = event.beta; // ( -180, 180 )
        orientationController.gamma = event.gamma; // ( -90, 90 )
        orientationController.dispatch(new ApplicationEvent(ApplicationEvent.APPLICATION_DEVICE_ORIENTATION, orientationController.sourceOrientationEventVO(event)));
    }
    onMotion(event) {
        let orientationController = OrientationController.instance;
        orientationController.acceleration = event.acceleration;
        orientationController.accelerationIncludingGravity = event.accelerationIncludingGravity;
        orientationController.rotationRate = event.rotationRate;
        orientationController.dispatch(new ApplicationEvent(ApplicationEvent.APPLICATION_DEVICE_MOTION, orientationController.sourceOrientationEventVO(event)));
    }
    // DISPATCH
    dispatch(event) {
        if (!this.target)
            return;
        this.target.dispatchEvent(event);
    }
    // SOURCE VO
    sourceOrientationEventVO(event = null) {
        return new SourceOrientationEventVO(event);
    }
}
//# sourceMappingURL=OrientationController.js.map