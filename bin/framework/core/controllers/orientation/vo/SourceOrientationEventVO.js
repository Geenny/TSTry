export default class SourceOrientationEventVO {
    constructor(event) {
        this.event = {};
        this.parse(event);
    }
    parse(event) {
        if (!event)
            event = {};
        this.event = event;
        this.acceleration = event.acceleration;
        this.accelerationIncludingGravity = event.accelerationIncludingGravity;
        this.rotationRate = event.rotationRate;
    }
}
//# sourceMappingURL=SourceOrientationEventVO.js.map