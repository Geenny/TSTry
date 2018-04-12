
export default class SourceOrientationEventVO implements IVO {

    public acceleration: DeviceAcceleration;
    public accelerationIncludingGravity: DeviceAcceleration;
    public rotationRate: DeviceRotationRate;

    public event: any = {};

    constructor( event ) {
        this.parse( event );
    }

    public parse( event ) {

        if ( !event ) event = {};
        this.event = event;

        this.acceleration = event.acceleration;
        this.accelerationIncludingGravity = event.accelerationIncludingGravity;
        this.rotationRate = event.rotationRate;

    }

}